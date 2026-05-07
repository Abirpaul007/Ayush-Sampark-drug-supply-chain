import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import mongoose from 'mongoose';

import PharmacyOrder from '@/lib/models/orderp';
import VendorInventory from '@/lib/models/Vendor-Inventory';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { orderId } = await req.json();

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return NextResponse.json({ error: 'Invalid orderId format' }, { status: 400 });
  }

  try {
    const order = await PharmacyOrder.findById(orderId);
    if (!order || order.manufacturerStatus !== 'Pending') {
      return NextResponse.json({ error: 'Invalid or already processed order' }, { status: 400 });
    }

    // Get all valid (non-expired) FIFO batches for this medicine from the vendor
    const today = new Date();
    const batches = await VendorInventory.find({
      medicineId: order.medicineId,
      userId: user._id, // Only fetch vendor's batches
      stockQuantity: { $gt: 0 },
      expiryDate: { $gte: today },
    }).sort({ expiryDate: 1 });

    let remainingQty = order.quantity;
    const dispatchedBatches: any[] = [];

    for (const batch of batches) {
      if (remainingQty <= 0) break;

      const usedQty = Math.min(batch.stockQuantity, remainingQty);
      batch.stockQuantity -= usedQty;
      remainingQty -= usedQty;

      dispatchedBatches.push({
        batchId: batch._id,
        batchNumber: batch.batchNumber,
        expiryDate: batch.expiryDate,
        quantity: usedQty,
        price: batch.offerPrice,
      });

      await batch.save();
    }

    if (remainingQty > 0) {
      return NextResponse.json({ error: 'Not enough stock to fulfill the order' }, { status: 400 });
    }

    order.dispatchedBatches = dispatchedBatches;
    order.manufacturerStatus = 'Dispatched';
    await order.save();

    return NextResponse.json({ message: 'Order dispatched successfully', order }, { status: 200 });

  } catch (error) {
    console.error('[VENDOR_ACCEPT_ORDER_ERROR]', error);
    return NextResponse.json({ error: 'Failed to dispatch order' }, { status: 500 });
  }
}
