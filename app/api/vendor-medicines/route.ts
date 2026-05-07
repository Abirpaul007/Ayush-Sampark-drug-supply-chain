// app/api/vendor-medicines/route.ts

import dbConnect from '@/lib/db/mongodborder';
import Medicine from '@/lib/models/medicine';
import VendorInventory from '@/lib/models/Vendor-Inventory';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only show medicines added by the logged-in vendor
    const medicines = await Medicine.find({ userId: session.user._id || session.user.id });
    return NextResponse.json(medicines);
  } catch (error) {
    console.error("Error fetching medicines:", error);
    return NextResponse.json({ message: 'Error fetching medicines' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Parse & sanitize numeric values with default fallbacks
    const parsedData = {
      ...data,
      userId: session.user._id || session.user.id,
      mrp: parseFloat(data.mrp || 0),
      offerPrice: parseFloat(data.offerPrice || data.mrp || 0),
      gst: parseFloat(data.gst || 0),
      stockQuantity: parseInt(data.stockQuantity || 0),
      minOrderQuantity: parseInt(data.minOrderQuantity || 0),
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      manufacturingDate: data.manufacturingDate ? new Date(data.manufacturingDate) : null,
    };

    const medicine = new Medicine(parsedData);
    await medicine.save();
    return NextResponse.json({ message: 'Medicine catalogue added successfully!' }, { status: 201 });
  } catch (error: any) {
    console.error("Error saving medicine and inventory:", error.message);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
