import dbConnect from '@/lib/db/mongodborder';
import PharmacyOrder from '@/lib/models/orderp';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { orderId, status } = await req.json();
  
  const updatedOrder = await PharmacyOrder.findOneAndUpdate(
    { orderId },
    { manufacturerStatus: status },
    { new: true }
  );

  return NextResponse.json(updatedOrder);
}
