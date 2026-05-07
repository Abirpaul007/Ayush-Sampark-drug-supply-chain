

// /app/api/delivered_ordersp/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import PharmacyOrder from '@/lib/models/orderh';
import { User } from '@/lib/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const hospitalUserId = session?.user?._id;

    if (!hospitalUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // ✅ Find the hospital user's organization name
    const hospitalUser = await User.findById(hospitalUserId);
    const hospitalName = hospitalUser?.organization;

    if (!hospitalName) {
      return NextResponse.json({ error: 'Hospital name not found' }, { status: 404 });
    }

    // ✅ Fetch delivered orders with matching hospital name
    const deliveredOrders = await PharmacyOrder.find({
      hospitalName: hospitalName,
      manufacturerStatus: 'Delivered',
    }).select('_id orderId hospitalName manufacturerStatus vendorId');

    return NextResponse.json(deliveredOrders);
  } catch (err) {
    console.error('Error fetching delivered orders:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
