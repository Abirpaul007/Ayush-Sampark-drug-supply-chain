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
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    const expiredBatches = await VendorInventory.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          expiryDate: {
            $lt: today,
            $gte: sixMonthsAgo,
          },
          stockQuantity: { $gt: 0 }, // Exclude depleted stock
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
        $project: {
          _id: 1,
          batchNumber: 1,
          expiryDate: 1,
          manufacturingDate: 1,
          stockQuantity: 1,
          mrp: 1,
          offerPrice: 1,
          'medicine.brandName': 1,
          'medicine.genericName': 1,
        },
      },
      { $sort: { expiryDate: 1 } },
    ]);

    return NextResponse.json(expiredBatches);
    
  } catch (error) {
    console.error('Error fetching expiry log:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
