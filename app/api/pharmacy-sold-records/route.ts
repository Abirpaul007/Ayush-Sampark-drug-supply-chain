import { NextResponse } from 'next/server';
import PharmacySoldLog from '@/lib/models/Pharmacy-Sold';
import PharmacyOrder from '@/lib/models/orderp';
import dbConnect from '@/lib/db/mongodborder';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(request: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Get optional filters
    const medicineId = searchParams.get('medicineId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const filter: any = {
      pharmacyId: session.user._id, // Only fetch logs for logged-in pharmacy
    };

    if (medicineId) filter.medicineId = medicineId;

    if (startDate || endDate) {
      filter.saleDate = {};
      if (startDate) filter.saleDate.$gte = new Date(startDate);
      if (endDate) filter.saleDate.$lte = new Date(endDate);
    }

    // Step 1: Get all unique medicine IDs from filtered sold logs
    const soldMedicines = await PharmacySoldLog.find(filter).distinct('medicineId');

    // Step 2: Map medicineId to medicineName using PharmacyOrder
    const medicineDetails = await PharmacyOrder.find({
      medicineId: { $in: soldMedicines },
    })
      .select('medicineId medicineName')
      .lean();

    const medicineMap = new Map();
    medicineDetails.forEach(order => {
      medicineMap.set(order.medicineId.toString(), order.medicineName);
    });

    // Step 3: Fetch paginated sold logs
    const [soldRecords, total] = await Promise.all([
      PharmacySoldLog.find(filter)
        .select('medicineId quantity saleDate')
        .sort({ saleDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      PharmacySoldLog.countDocuments(filter),
    ]);

    // Step 4: Transform the data
    const responseData = soldRecords.map(record => ({
      medicineId: record.medicineId,
      medicineName: medicineMap.get(record.medicineId.toString()) || 'Unknown Medicine',
      quantity: record.quantity,
      date: record.saleDate,
    }));

    return NextResponse.json({
      data: responseData,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching pharmacy sold records:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
