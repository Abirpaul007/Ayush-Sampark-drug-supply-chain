import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import PharmacyOrder from '@/lib/models/orderp';  // Notice: using PharmacyOrder model now

export async function POST(req: Request) {
  try {
    const { orderId, newStatus } = await req.json();

    await dbConnect();

    const order = await PharmacyOrder.findOne({ _id: orderId });

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    order.manufacturerStatus = newStatus;
    await order.save();

    return NextResponse.json({ message: 'Order status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
