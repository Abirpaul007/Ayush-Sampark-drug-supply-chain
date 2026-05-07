// app/api/vendor-reject-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import Order from '@/lib/models/orderh';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { _id } = await req.json();

  try {
    const order = await Order.findById(_id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.manufacturerStatus !== 'Pending') {
      return NextResponse.json({ error: 'Only pending orders can be rejected' }, { status: 400 });
    }

    order.manufacturerStatus = 'Rejected';
    await order.save();

    return NextResponse.json({ success: true, message: 'Order rejected successfully' });
  } catch (err) {
    console.error('[REJECT_ORDER_ERROR]', err);
    return NextResponse.json({ error: 'Failed to reject order' }, { status: 500 });
  }
}
