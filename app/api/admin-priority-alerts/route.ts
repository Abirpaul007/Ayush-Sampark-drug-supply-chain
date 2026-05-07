import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import VendorInventory from '@/lib/models/Vendor-Inventory';
import Order from '@/lib/models/orderh';
import PharmacyOrder from '@/lib/models/orderp';
import Medicine from '@/lib/models/medicine';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const alerts: any[] = [];

    // ✅ 1. Stock Alerts (stockQuantity = 0)
    const stockItems = await VendorInventory.find({ stockQuantity: 0 })
      .populate({
        path: 'medicineId',
        model: Medicine,
        select: 'brandName', // Only fetch brandName
      })
      .lean();

    stockItems.forEach((item: any) => {
      alerts.push({
        type: 'Stock',
        title: `${item.medicineId?.brandName || 'Unknown'} Stock Critical`,
        message: `Stock for ${item.medicineId?.brandName || 'this medicine'} is 0`,
        level: 'Urgent',
      });
    });

    // ✅ 2. Emergency Orders (deliveryDate - createdAt < 48 hrs, status = Pending)
    const [hospitalOrders, pharmacyOrders] = await Promise.all([
      Order.find({ manufacturerStatus: 'Pending' }).lean(),
      PharmacyOrder.find({ manufacturerStatus: 'Pending' }).lean(),
    ]);

    const now = new Date();

    [...hospitalOrders, ...pharmacyOrders].forEach((order: any) => {
      if (!order.createdAt || !order.deliveryDate) return;

      const created = new Date(order.createdAt);
      const delivery = new Date(order.deliveryDate);
      const diffHours = (delivery.getTime() - created.getTime()) / (1000 * 60 * 60);

      if (diffHours < 48) {
        alerts.push({
          type: 'Request',
          title: `Emergency: ${order.medicineName}`,
          message: `${order.hospitalName} needs ${order.medicineName} in < 48 hrs`,
          level: 'Priority',
        });
      }
    });

    return NextResponse.json({ success: true, alerts });
  } catch (error) {
    console.error('[ALERTS_API_ERROR]', error);
    return NextResponse.json(
      { success: false, alerts: [], message: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}
