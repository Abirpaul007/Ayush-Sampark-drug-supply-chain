import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import HospitalInventory from '@/lib/models/Hospital-Inventory';
import Medicine from '@/lib/models/medicine';

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

    const filteredInventory = inventory.map((item) => {
      const validBatches = (item.batches || []).filter(
        (batch: any) => new Date(batch.expiryDate) >= now
      );

      const nonExpiredStock = validBatches.reduce((sum: number, b: any) => sum + b.quantity, 0);

      return {
        inventoryId: (item as any)._id.toString(),
        medicineId: item.medicineId?._id?.toString() || '',
        medicineName: item.medicineId?.brandName || 'Unknown',
        totalStock: nonExpiredStock, // calculated live
        lastOrderedDate: item.lastOrderedDate,
      };
    });

    
    return NextResponse.json(filteredInventory, { status: 200 });
  } catch (error) {
    console.error('[HOSPITAL_INVENTORY_FETCH_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}
