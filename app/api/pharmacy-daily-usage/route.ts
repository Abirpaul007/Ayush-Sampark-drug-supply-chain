// /app/api/pharmacy-daily-usage/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import PharmacySoldLog from '@/lib/models/Pharmacy-Sold';
import Medicine from '@/lib/models/medicine';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Only fetch logs for the authenticated pharmacy
    const logs = await PharmacySoldLog.find({
      pharmacyId: session.user._id,
    }).populate({
      path: 'medicineId',
      model: Medicine,
      select: 'brandName',
    });

    const grouped = logs.reduce((acc: Record<string, Record<string, number>>, log) => {
      const date = new Date(log.saleDate).toISOString().split('T')[0];
      const brand = log.medicineId && typeof log.medicineId === 'object' ? log.medicineId.brandName : 'Unknown';

      if (!acc[date]) acc[date] = {};
      if (!acc[date][brand]) acc[date][brand] = 0;

      acc[date][brand] += log.quantity;
      return acc;
    }, {});

    const result = Object.entries(grouped).flatMap(([date, brands]) =>
      Object.entries(brands).map(([brandName, sold]) => ({
        date,
        brandName,
        sold,
      }))
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error('[ERROR] /api/pharmacy-daily-usage:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
