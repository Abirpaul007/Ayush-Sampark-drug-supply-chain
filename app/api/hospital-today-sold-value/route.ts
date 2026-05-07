import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import DispenseLog from '@/lib/models/dispenseLog';
import Order from '@/lib/models/orderh';
import { isSameDay } from 'date-fns';

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
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's dispense logs
    const todayLogs = await DispenseLog.find({
      dispensedAt: {
        $gte: today,
        $lt: tomorrow,
      },
      hospitalId: session.user._id,
    }).lean();

    let todayTotalSold = 0;
    const detailedLogs: {
      medicineId: string;
      batchNumber: string;
      usedQuantity: number;
      pricePerUnit: number;
      totalValue: number;
      dispensedAt: Date;
    }[] = [];

    for (const log of todayLogs) {
      const { medicineId, dispensedFrom, dispensedAt } = log;

      for (const disp of dispensedFrom) {
        const { batchNumber, usedQuantity } = disp;

        // Find all orders where dispatchedBatches include this batchNumber and same medicineId
        const orders = await Order.find({
          medicineId: medicineId,
          'dispatchedBatches.batchNumber': batchNumber,
        }).lean();

        let matched = false;

        for (const order of orders) {
          for (const batch of order.dispatchedBatches) {
            if (batch.batchNumber === batchNumber) {
              const price = batch.price ?? 0;
              const value = usedQuantity * price;
              todayTotalSold += value;

              detailedLogs.push({
                medicineId: medicineId.toString(),
                batchNumber,
                usedQuantity,
                pricePerUnit: price,
                totalValue: value,
                dispensedAt,
              });

              matched = true;
              break;
            }
          }

          if (matched) break;
        }
      }
    }
    // console.log("detailedLogs",detailedLogs);
    

    return NextResponse.json({
      success: true,
      totalTodayValue: todayTotalSold,
      detailedLogs,
    });
  } catch (error) {
    console.error('Error in today sold value API:', error);
    return NextResponse.json(
      { success: false, message: 'Server Error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
