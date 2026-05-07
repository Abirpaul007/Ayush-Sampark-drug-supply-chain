import dbConnect from '@/lib/db/mongodborder';
import Order from '@/lib/models/orderh';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { orderId, status } = await req.json();
  
  const updatedOrder = await Order.findOneAndUpdate(
    { orderId },
    { manufacturerStatus: status },
    { new: true }
  );

  return NextResponse.json(updatedOrder);
}
