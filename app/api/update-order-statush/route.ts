import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder'; // your db connection utility
import Order from '@/lib/models/orderh'; // your mongoose order model

export async function POST(req: Request) {
  try {
    const { orderId, newStatus } = await req.json();

    await dbConnect();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    order.manufacturerStatus = newStatus;
    await order.save();

    return NextResponse.json({ message: 'Order status updated' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
