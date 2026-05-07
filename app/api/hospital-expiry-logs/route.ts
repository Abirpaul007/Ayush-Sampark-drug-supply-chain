// /app/api/hospital-expiry-logs/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import HospitalInventory from '@/lib/models/Hospital-Inventory';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !user._id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const inventory = await HospitalInventory.find({ hospitalId: user._id })
      .populate('medicineId', 'brandName genericName')
      .lean();

    const expiredBatches: any[] = [];

    for (const item of inventory) {
      for (const batch of item.batches || []) {
        const expiry = new Date(batch.expiryDate);
        if (expiry < new Date() && expiry > sixMonthsAgo) {
          expiredBatches.push({
            _id: (item as any)._id.toString(),
            medicineName: item.medicineId?.brandName || 'Unknown',
            genericName: item.medicineId?.genericName || '',
            batchNumber: batch.batchNumber,
            quantity: batch.quantity,
            expiryDate: expiry,
          });
        }
      }
    }

    return NextResponse.json({ expired: expiredBatches }, { status: 200 });
  } catch (error) {
    console.error('[EXPIRY_LOGS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch expiry logs' }, { status: 500 });
  }
}
