import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import HospitalInventory from '@/lib/models/Hospital-Inventory';
import Medicine from '@/lib/models/medicine';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || user.role !== 'HOSPITAL') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();

    const inventories = await HospitalInventory.find({ hospitalId: user._id })
      .populate('medicineId', 'brandName genericName')
      .lean();

    const filtered = inventories.map((inv) => {
      // Filter out expired batches
      const validBatches = inv.batches.filter((batch: any) => new Date(batch.expiryDate) > now);

      // Calculate totalStock from valid batches
      const currentStock = validBatches.reduce((sum: number, batch: any) => sum + batch.quantity, 0);

      return {
        medicineId: inv.medicineId._id,
        brandName: inv.medicineId.brandName,
        genericName: inv.medicineId.genericName,
        totalStock: currentStock,
      };
    });

    // console.log("filtered", filtered);
    

    return NextResponse.json(filtered, { status: 200 });
  } catch (err) {
    console.error('[HOSPITAL_CONSUMPTION_ERROR]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
