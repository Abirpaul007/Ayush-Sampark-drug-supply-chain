// app/api/vendor-inventory/route.ts

import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import VendorInventory from '@/lib/models/Vendor-Inventory';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'VENDOR') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user._id || session.user.id;

    const today = new Date();

    const inventory = await VendorInventory.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          expiryDate: { $gte: today }, // Exclude expired batches
        },
      },
      {
        $lookup: {
          from: 'medicines',
          localField: 'medicineId',
          foreignField: '_id',
          as: 'medicine',
        },
      },
      { $unwind: '$medicine' },
      {
        $group: {
          _id: '$medicineId',
          brandName: { $first: '$medicine.brandName' },
          genericName: { $first: '$medicine.genericName' },
          totalStock: { $sum: '$stockQuantity' },
          minOfferPrice: { $min: '$offerPrice' },
          batches: {
            $push: {
              _id: '$_id',
              batchNumber: '$batchNumber',
              expiryDate: '$expiryDate',
              manufacturingDate: '$manufacturingDate',
              stockQuantity: '$stockQuantity',
              mrp: '$mrp',
              offerPrice: '$offerPrice',
            },
          },
        },
      },
      { $sort: { brandName: 1 } },
    ]);

    return NextResponse.json(inventory);
  } catch (error) {
    console.error('Error fetching vendor inventory:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
