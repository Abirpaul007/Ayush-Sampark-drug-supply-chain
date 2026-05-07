import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import PharmacySoldLog from '@/lib/models/Pharmacy-Sold';
import PharmacyInventory from '@/lib/models/Pharmacy-Inventory';
import Medicine from '@/lib/models/medicine';
import { User } from '@/lib/models/User';
import mongoose from 'mongoose';

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find the pharmacy user
    const user = await User.findOne({ email: session.user.email, role: 'PHARMACY' });
    if (!user) {
     
      return NextResponse.json({ error: 'Pharmacy not found' }, { status: 404 });
    }

    const pharmacyId = user._id;

    // Aggregate total sold quantity per medicine
    const soldLogs = await PharmacySoldLog.aggregate([
      { $match: { pharmacyId } },
      {
        $group: {
          _id: '$medicineId',
          totalSold: { $sum: '$quantity' },
        },
      },
    ]);

    // Get inventory entries for this pharmacy
    const inventories = await PharmacyInventory.find({ hospitalId: pharmacyId }).lean();

    // Map sold and stock data by medicineId
    const medicineMap = new Map();

    soldLogs.forEach((log) => {
      medicineMap.set(log._id.toString(), {
        totalSold: log.totalSold,
        totalStock: 0,
      });
    });

    inventories.forEach((inv) => {
      const key = inv.medicineId.toString();
      const existing = medicineMap.get(key) || { totalSold: 0, totalStock: 0 };
      existing.totalStock = inv.totalStock;
      medicineMap.set(key, existing);
    });

    // Fetch medicine details for all involved medicineIds
    const medicineIds = Array.from(medicineMap.keys()).map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const medicineDocs = await Medicine.find({ _id: { $in: medicineIds } }).lean();

    // Build response array
    const stats = medicineDocs.map((med) => {
      const key = (med as any)._id.toString();
      const data = medicineMap.get(key);
      return {
        medicineId: key,
        brandName: med.brandName,
        totalSold: data?.totalSold || 0,
        totalStock: data?.totalStock || 0,
      };
    });

    

    return NextResponse.json(stats);
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
