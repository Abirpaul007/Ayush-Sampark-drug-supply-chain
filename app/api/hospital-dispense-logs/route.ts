import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import DispenseLog from '@/lib/models/dispenseLog';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !user._id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const logs = await DispenseLog.find({ hospitalId: user._id })
      .populate('medicineId', 'brandName genericName')
      .populate('dispensedFrom.batchId', 'price')
      .sort({ dispensedAt: -1 })
      .lean();

    const summary = logs.map((log) => {
      const totalValue = log.dispensedFrom.reduce((sum: number, item: any) => {
        const price = item.batchId?.price || 0;
        return sum + (item.usedQuantity * price);
      }, 0);

      return {
        _id: log._id,
        medicine: log.medicineId,
        quantity: log.quantity,
        recipient: log.recipient,
        dispensedAt: log.dispensedAt,
      };
    });

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error('[DISPENSE_SUMMARY_FETCH_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch dispense summary' }, { status: 500 });
  }
}
