// /app/api/admin/analytics/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import Order from '@/lib/models/orderh';
import PharmacyOrder from '@/lib/models/orderp';
import VendorInventory from '@/lib/models/Vendor-Inventory';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();

  try {
    const today = new Date();

    // Monthly Sales Calculation (manufacturer + pharmacy)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthlyDeliveredOrders = await Order.find({
      manufacturerStatus: 'Delivered',
      deliveryDate: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const monthlyDeliveredPharmacyOrders = await PharmacyOrder.find({
      manufacturerStatus: 'Delivered',
      deliveryDate: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const monthlySales = [...monthlyDeliveredOrders, ...monthlyDeliveredPharmacyOrders].reduce(
      (total, order) => total + (order.totalValue || 0),
      0
    );

    const totalOrdersManufacturer = await Order.countDocuments();
    const totalOrdersPharmacy = await PharmacyOrder.countDocuments();
    const totalOrders = totalOrdersManufacturer + totalOrdersPharmacy;

    // Inventory Value Calculation
    const batches = await VendorInventory.find();
    const inventoryValue = batches.reduce(
      (total, batch) => total + (batch.offerPrice || 0) * (batch.stockQuantity || 0),
      0
    );

    // Expired Drugs Count
    const expiredDrugs = await VendorInventory.countDocuments({
      expiryDate: { $lt: today },
    });

    // Order Status Pie Chart Data using manufacturerStatus
    const statuses = ['Delivered', 'Pending', 'Rejected'];
    const orderStatusDistribution = await Promise.all(
      statuses.map(async (status) => {
        const countManufacturer = await Order.countDocuments({ manufacturerStatus: status });
        const countPharmacy = await PharmacyOrder.countDocuments({ manufacturerStatus: status });
        return {
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: countManufacturer + countPharmacy,
        };
      })
    );

    // Monthly Sales Trend (last 6 months) using manufacturerStatus
    const barData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

      const monthOrders = await Order.find({
        manufacturerStatus: 'Delivered',
        deliveryDate: { $gte: monthStart, $lte: monthEnd },
      });

      const monthPharmacyOrders = await PharmacyOrder.find({
        manufacturerStatus: 'Delivered',
        deliveryDate: { $gte: monthStart, $lte: monthEnd },
      });

      const monthSales = [...monthOrders, ...monthPharmacyOrders].reduce(
        (sum, order) => sum + (order.totalValue || 0),
        0
      );

      barData.push({
        name: monthStart.toLocaleString('default', { month: 'short' }),
        sales: monthSales,
      });
    }

    return NextResponse.json({
      monthlySales,
      totalOrders,
      inventoryValue,
      expiredDrugs,
      orderStatusDistribution,
      monthlySalesTrend: barData,
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}
