import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import Pod from '@/lib/models/pod';
import Order from '@/lib/models/orderh';
import PharmacyOrder from '@/lib/models/orderp';
import Medicine from '@/lib/models/medicine';
import { User } from '@/lib/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const vendorId = session?.user?._id?.toString();

    if (!vendorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // 1. Get all medicines for this vendor
    const vendorMedicines = await Medicine.find({ userId: vendorId }, '_id');
    const medicineIds = vendorMedicines.map((med) => med._id);

    // 2. Fetch delivered hospital orders
    const hospitalOrders = await Order.find({
      medicineId: { $in: medicineIds },
      manufacturerStatus: 'Delivered',
    });
    const hospitalOrderIds = hospitalOrders.map((o) => o.orderId);

    // 3. Fetch delivered pharmacy orders
    const pharmacyOrders = await PharmacyOrder.find({
      medicineId: { $in: medicineIds },
      manufacturerStatus: 'Delivered',
    });
    const pharmacyOrderIds = pharmacyOrders.map((o) => o.orderId);

    // 4. Fetch relevant PODs
    const allPods = await Pod.find({
      vendorId,
      orderId: { $in: [...hospitalOrderIds, ...pharmacyOrderIds] },
    });

    // 5. Map users from hospitalUserIds
    const userIds = allPods.map((p) => p.hospitalUserId);
    const users = await User.find({ _id: { $in: userIds } }, '_id role name organization');

    const userMap = new Map(users.map((user) => [user._id.toString(), user]));

    // 6. Construct final POD data
    const enrichedPods = allPods.map((pod) => {
      const user = userMap.get(pod.hospitalUserId.toString());
      const role = user?.role || 'unknown';
      const source = role === 'PHARMACY' ? 'pharmacy' : role === 'HOSPITAL' ? 'hospital' : 'unknown';

      return {
        _id: pod._id,
        orderId: pod.orderId,
        podUrl: pod.podUrl,
        uploadedAt: pod.uploadedAt,
        hospitalName: user?.name || pod.hospitalName,
        organization: user?.organization || '',
        vendorId: pod.vendorId,
        hospitalUserId: pod.hospitalUserId,
        source,
        role,
      };
    });

    return NextResponse.json(enrichedPods);
  } catch (err) {
    console.error('Error in get_combined_pods:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
