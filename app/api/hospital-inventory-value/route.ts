import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import HospitalInventory from '@/lib/models/Hospital-Inventory';
import HospitalOrder from '@/lib/models/orderh';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !user._id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const inventory = await HospitalInventory.find({ hospitalId: user._id })
      .populate('medicineId', 'brandName')
      .lean();

    const now = new Date();

    let grandTotalValue = 0;

    for (const item of inventory) {
      const validBatches = (item.batches || []).filter(
        (batch: any) => new Date(batch.expiryDate) >= now
      );

      const hospitalOrders = await HospitalOrder.find({
        userId: user._id,
        medicineId: item.medicineId?._id,
      }).select('dispatchedBatches').lean();

      const dispatched = hospitalOrders.flatMap((order) => order.dispatchedBatches || []);

      for (const batch of validBatches) {
        const match = dispatched.find(
          (d) => d.batchNumber === batch.batchNumber
        );
        if (match && match.price != null) {
          grandTotalValue += batch.quantity * match.price;
        }
      }
    }
    console.log("total value",grandTotalValue);
    

    return NextResponse.json({ totalInventoryValue: grandTotalValue }, { status: 200 });
  } catch (error) {
    console.error('[HOSPITAL_INVENTORY_TOTAL_VALUE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to calculate total value' }, { status: 500 });
  }
}
