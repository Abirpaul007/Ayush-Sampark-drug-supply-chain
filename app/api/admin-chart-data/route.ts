import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import HospitalOrder from '@/lib/models/orderh';
import PharmacyOrder from '@/lib/models/orderp';

export async function GET() {
  await dbConnect();

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const hospitalOrders = await HospitalOrder.find({
    deliveryDate: { $gte: sevenDaysAgo },
    updatedAt: { $exists: true },
  }).lean();

  const pharmacyOrders = await PharmacyOrder.find({
    deliveryDate: { $gte: sevenDaysAgo },
    updatedAt: { $exists: true },
  }).lean();

  const allOrders = [...hospitalOrders, ...pharmacyOrders];

  const daysMap: Record<string, { count: number; totalHours: number }> = {};

  // Delivery status counters (only On Time and Delayed)
  let onTime = 0;
  let delayed = 0;

  allOrders.forEach((order) => {
    const createdAt = new Date(order.createdAt);
    const updatedAt = new Date(order.updatedAt);
    const deliveryDate = new Date(order.deliveryDate);

    const diffInHours = (updatedAt.getTime() - createdAt.getTime()) / 36e5;
    const day = updatedAt.toLocaleDateString('en-US', { weekday: 'short' });

    if (!daysMap[day]) daysMap[day] = { count: 0, totalHours: 0 };
    daysMap[day].count++;
    daysMap[day].totalHours += diffInHours;

    // ✅ Delivery status logic (only count Delivered orders)
    if (order.manufacturerStatus === 'Delivered') {
      if (deliveryDate >= updatedAt) {
        onTime++;
      } else {
        delayed++;
      }
    }
  });

  const allDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const avgDeliveryTime = allDays.map((day) => {
    const stats = daysMap[day];
    return stats ? parseFloat((stats.totalHours / stats.count).toFixed(2)) : 0;
  });

  const deliveryStatus = [
    {
      name: 'On Time',
      value: onTime,
      itemStyle: { color: '#10B981' },
    },
    {
      name: 'Delayed',
      value: delayed,
      itemStyle: { color: '#F59E0B' },
    },
  ];

  return NextResponse.json({
    success: true,
    avgDeliveryTime,
    deliveryStatus,
  });
}
