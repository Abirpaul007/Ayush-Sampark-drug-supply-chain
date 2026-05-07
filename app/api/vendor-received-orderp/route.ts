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
    const vendorId = user._id;

    // Step 1: Fetch pending orders with populated medicine info
    const allPendingOrders = await PharmacyOrder.find({
      manufacturerStatus: 'Pending',
    })
      .populate({
        path: 'medicineId',
        select: 'name userId',
      })
      .lean();

    // Step 2: Filter orders where the medicine’s vendor matches current user
    const filteredOrders = allPendingOrders.filter(
      (PharmacyOrder) => PharmacyOrder.medicineId?.userId?.toString() === vendorId.toString()
    );
    // console.log(filteredOrders);

    return NextResponse.json(filteredOrders, { status: 200 });

  } catch (error) {
    console.error('[VENDOR_ORDERS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch vendor orders' }, { status: 500 });
  }
}
