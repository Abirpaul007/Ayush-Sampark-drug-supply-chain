import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import PharmacyInventory from '@/lib/models/Pharmacy-Inventory';
import PharmacyOrder from '@/lib/models/orderp';
import PharmacySoldLog from '@/lib/models/Pharmacy-Sold';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hospitalId = session.user._id; // logged-in pharmacy user's ID

    await dbConnect();

    const inventories = await PharmacyInventory.find({ hospitalId }).lean();

    let totalValue = 0;

    for (const item of inventories) {
      try {
        const { medicineId, totalStock } = item;

        // Get latest order to find price — filter by userId (same as hospitalId)
        const latestOrder = await PharmacyOrder.findOne({ medicineId, userId: hospitalId })
          .sort({ orderDate: -1 })
          .lean();

        const price = Number((latestOrder as any)?.price) || 0;

        // Calculate total sold quantity for this medicine — filter by pharmacyId (same as hospitalId)
        const soldLogs = await PharmacySoldLog.aggregate([
          { $match: { medicineId, pharmacyId: hospitalId } },
          { $group: { _id: '$medicineId', totalSold: { $sum: '$quantity' } } },
        ]);

        const soldQty = Array.isArray(soldLogs) && soldLogs[0]?.totalSold ? soldLogs[0].totalSold : 0;
        const currentStock = Math.max(totalStock - soldQty, 0);

        totalValue += currentStock * price;
      } catch (error) {
        console.error(`Error processing inventory item ${item._id}:`, error);
      }
    }

    return NextResponse.json({
      inventoryValue: totalValue,
    });
  } catch (error) {
    console.error('Error in inventory value API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
