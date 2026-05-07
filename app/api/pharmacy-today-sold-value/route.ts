// /app/api/pharmacy/today-sold-value/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options'; // adjust path if needed
import dbConnect from '@/lib/db/mongodborder';
import PharmacySoldLog from '@/lib/models/Pharmacy-Sold';
import VendorInventory from '@/lib/models/Vendor-Inventory';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?._id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayLogs = await PharmacySoldLog.find({
      saleDate: { $gte: today, $lt: tomorrow },
      pharmacyId: session.user._id, // Only this user's logs
    }).lean();

    if (!todayLogs.length) {
      return NextResponse.json({ todaySalesValue: 0 });
    }

    const inventories = await VendorInventory.find({}, 'batchNumber offerPrice').lean();
    const batchPriceMap = new Map<string, number>();
    inventories.forEach(inv => {
      if (inv.batchNumber) {
        batchPriceMap.set(inv.batchNumber, inv.offerPrice || 0);
      }
    });

    let total = 0;
    for (const log of todayLogs) {
      for (const disp of log.dispensedFrom || []) {
        const price = batchPriceMap.get(disp.batchNumber) || 0;
        total += price * disp.quantity;
      }
    }

    return NextResponse.json({ todaySalesValue: total });
  } catch (error) {
    console.error('[ERROR] /api/pharmacy/today-sold-value:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
