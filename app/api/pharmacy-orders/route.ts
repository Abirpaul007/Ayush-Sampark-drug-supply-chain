// /app/api/hospital/my-orders/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import PharmacyOrder from '@/lib/models/orderp';
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
    const orders = await PharmacyOrder.find({ userId: user._id })
      .select('orderId medicineName quantity totalValue deliveryDate manufacturerStatus orderDate')
      .sort({ orderDate: -1 })
      .lean();

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('[PHARMACY_MY_ORDERS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
