import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import Order from '@/lib/models/orderh'; // ⬅ Updated to match your model
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = new mongoose.Types.ObjectId(session.user._id);

  try {
    const logs = await Order.find({
      userId,
      manufacturerStatus: 'delivered', // Only show delivered orders
    })
      .sort({ deliveryDate: -1 }) // Sort by delivery date
      .lean();

    return NextResponse.json(
      logs.map((log) => ({
        _id: log._id,
        medicineName: log.medicineName,
        quantity: log.quantity,
        hospitalName: log.hospitalName,
        deliveryDate: log.deliveryDate,
        manufacturerStatus: log.manufacturerStatus,
        price: log.price,
        totalValue: log.totalValue,
      }))
    );
  } catch (error) {
    console.error('Delivery logs fetch error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
