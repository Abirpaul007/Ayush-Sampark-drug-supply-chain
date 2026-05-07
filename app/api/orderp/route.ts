

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import PharmacyOrder from '@/lib/models/orderp';
import VendorInventory from '@/lib/models/Vendor-Inventory';
import Medicine from '@/lib/models/medicine';
import { User } from '@/lib/models/User';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  await dbConnect();

  try {
    const orders = await PharmacyOrder.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('[DEBUG_ORDER_FETCH_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { medicineId, vendorId, hospitalName, deliveryDate, quantity } = await req.json();
    const today = new Date();

    // Fetch user details from DB to get organization
    const hospitalUser = await User.findById(user._id).select('organization');
    if (!hospitalUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }


    // Get the minimum offer price for that medicine from this vendor
    const bestBatch = await VendorInventory.findOne({
      medicineId,
      userId: vendorId,
      expiryDate: { $gte: today },
      stockQuantity: { $gt: 0 },
    }).sort({ expiryDate: 1 }); // FIFO batch used only for price reference

    if (!bestBatch) {
      return NextResponse.json({ error: 'No valid batch available' }, { status: 400 });
    }

    const medicineDoc = await Medicine.findById(medicineId);
    if (!medicineDoc) {
      return NextResponse.json({ error: 'Medicine not found' }, { status: 404 });
    }

    const avgPrice = bestBatch.offerPrice;
    const totalValue = avgPrice * quantity;

    const newPharmacyOrder = await PharmacyOrder.create({
      userId: user._id,
      orderId: uuidv4(),
      medicineId,
      medicineName: medicineDoc.brandName,
      quantity,
      price: avgPrice,
      hospitalName: hospitalUser.organization,
      totalValue,
      deliveryDate: new Date(deliveryDate),
      orderDate: new Date(),
      manufacturerStatus: 'Pending',
      dispatchedBatches: [], // initially empty, will be filled after vendor accepts
    });

    return NextResponse.json({ success: true, PharmacyOrder: newPharmacyOrder }, { status: 201 });

  } catch (error) {
    console.error('[ORDER_CREATE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}







