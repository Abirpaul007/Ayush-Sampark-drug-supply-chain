// app/api/vendor-invoice/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import Order from '@/lib/models/orderh';

import Medicine from '@/lib/models/medicine';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deliveredOrders = await Order.find({
      manufacturerStatus: 'Delivered',
    }).populate({
      path: 'medicineId',
      model: Medicine,
      select: 'brandName userId',
    });

    const vendorOrders = deliveredOrders
      .filter(order => {
        const med: any = order.medicineId;
        return med?.userId?.toString() === user._id.toString();
      })
      .map(order => ({
        orderId: order.orderId,
        hospitalName: order.hospitalName || 'Unknown',
        medicineName: (order.medicineId as any)?.brandName || 'Unknown',
        quantity: order.quantity || 0,
      }));

    return NextResponse.json(vendorOrders);
  } catch (err) {
    console.error('[VENDOR_ORDERS_ERROR]', err);
    return NextResponse.json(
      { error: 'Failed to fetch delivered orders' },
      { status: 500 }
    );
  }
}
