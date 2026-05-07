import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import PharmacyOrder from '@/lib/models/orderp';
import Medicine from '@/lib/models/medicine';
import {User} from '@/lib/models/User';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

    await dbConnect();

    const order = await PharmacyOrder.findOne({ orderId });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const medicine = await Medicine.findById(order.medicineId);
    if (!medicine) return NextResponse.json({ error: 'Medicine not found' }, { status: 404 });

    const vendor = await User.findById(medicine.userId);
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    return NextResponse.json({
      hospitalName: order.hospitalName,
      medicineId: medicine._id.toString(),
      vendorId: vendor._id.toString(),
      vendorName: vendor.name,
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
