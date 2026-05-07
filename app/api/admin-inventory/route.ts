import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import VendorInventory from '@/lib/models/Vendor-Inventory';
import Medicine from '@/lib/models/medicine';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const inventory = await VendorInventory.find()
      .populate({
        path: 'medicineId',
        model: Medicine,
      })
      .lean();

    return NextResponse.json({ success: true, inventory });
  } catch (error) {
    console.error('Error fetching vendor inventory:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch inventory' }, { status: 500 });
  }
}
