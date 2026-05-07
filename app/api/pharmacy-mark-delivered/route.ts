import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import PharmacyOrder from '@/lib/models/orderp';
import PharmacyInventory from '@/lib/models/Pharmacy-Inventory';

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !user._id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId } = await req.json();

    const order = await PharmacyOrder.findOneAndUpdate(
      {
        orderId,
        userId: user._id,
        manufacturerStatus: 'Out for Delivery',
      },
      { manufacturerStatus: 'Delivered' },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or already delivered' },
        { status: 404 }
      );
    }

    const today = new Date();

    for (const batch of order.dispatchedBatches) {
      const batchQty = Number(batch.quantity);

      // Skip expired or invalid batches
      if (new Date(batch.expiryDate) < today || !batchQty || isNaN(batchQty)) continue;

      const batchPayload = {
        batchNumber: batch.batchNumber,
        quantity: batchQty,
        expiryDate: batch.expiryDate,
      };

      const inventory = await PharmacyInventory.findOne({
        hospitalId: order.userId,
        medicineId: order.medicineId,
      });

      if (!inventory) {
        // No inventory entry exists — create new
        await PharmacyInventory.create({
          hospitalId: order.userId,
          medicineId: order.medicineId,
          totalStock: batchQty,
          lastOrderedDate: order.deliveryDate,
          batches: [batchPayload],
        });
      } else {
        // Push new batch (do not merge)
        inventory.batches.push(batchPayload);
        inventory.totalStock += batchQty;

        if (
          !inventory.lastOrderedDate ||
          new Date(order.deliveryDate) > new Date(inventory.lastOrderedDate)
        ) {
          inventory.lastOrderedDate = order.deliveryDate;
        }

        await inventory.save();
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('[MARK_DELIVERED_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
