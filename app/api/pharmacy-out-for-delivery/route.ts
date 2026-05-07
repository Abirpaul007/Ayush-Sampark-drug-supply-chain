// /app/api/hospital/out-for-delivery/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import PharmacyOrder from '@/lib/models/orderp';

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await PharmacyOrder.find({
      userId: user._id,
      manufacturerStatus: 'Out for Delivery',
    }).sort({ deliveryDate: 1 });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('[FETCH_DELIVERY_ORDERS]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
  
}
