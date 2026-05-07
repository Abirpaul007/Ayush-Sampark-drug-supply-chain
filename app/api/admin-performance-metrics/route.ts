import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import Order from '@/lib/models/orderh';
import PharmacyOrder from '@/lib/models/orderp';
import VendorInventory from '@/lib/models/Vendor-Inventory';
import Medicine from '@/lib/models/medicine';
import {User} from '@/lib/models/User'; // Ensure this model exists
import { Types } from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const filter = req.nextUrl.searchParams.get('filter') || 'monthly';
    const { start, end } = getDateRange(filter);

    // Get orders
    const [hospitalOrders, pharmacyOrders] = await Promise.all([
      Order.find({ orderDate: { $gte: start, $lte: end } }).lean(),
      PharmacyOrder.find({ orderDate: { $gte: start, $lte: end } }).lean(),
    ]);

    const allOrders = [...hospitalOrders, ...pharmacyOrders];

    // Metrics
    const totalOrders = allOrders.length;
    const fulfilledOrders = allOrders.filter(o => o.manufacturerStatus === 'Delivered');
    const fulfillmentRate = totalOrders > 0 ? Math.round((fulfilledOrders.length / totalOrders) * 100) : 0;
    const avgDeliveryTime = calculateAvgHours(fulfilledOrders);

    // Low stock & expired drugs
    const [lowStock, expiredDrugs] = await Promise.all([
      VendorInventory.countDocuments({ stockQuantity: { $lt: 50 } }),
      VendorInventory.countDocuments({ expiryDate: { $lt: new Date() } }),
    ]);

    // Get all medicineIds used in orders
    const medicineIds = allOrders.map(o => o.medicineId);
    type LeanMedicine = { _id: string | Types.ObjectId; userId: string | Types.ObjectId };
    const medicines = await Medicine.find({ _id: { $in: medicineIds } })
      .select('_id userId medicineName')
      .lean<LeanMedicine[]>();

    // Map medicineId to vendorId
    const medicineToVendor: Record<string, string> = {};
    medicines.forEach(med => {
      medicineToVendor[med._id.toString()] = med.userId.toString();
    });

    // Count vendor orders
    const vendorOrderCount: Record<string, number> = {};
    allOrders.forEach(order => {
      const vendorId = medicineToVendor[order.medicineId.toString()];
      if (vendorId) {
        vendorOrderCount[vendorId] = (vendorOrderCount[vendorId] || 0) + 1;
      }
    });

    const topVendors = Object.entries(vendorOrderCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Fetch vendor names
    const vendorIds = topVendors.map(([id]) => id);
    type LeanUser = { _id: string | Types.ObjectId; name?: string };
    const vendors = await User.find({ _id: { $in: vendorIds } })
      .select('name _id')
      .lean<LeanUser[]>();
    const vendorIdToName = Object.fromEntries(vendors.map(v => [v._id.toString(), v.name || 'Unknown Vendor']));

    const vendorOrders = topVendors.map(([vendorId, count]) => ({
      vendor: vendorIdToName[vendorId] || vendorId,
      orders: count,
    }));

    // Top ordered drugs
    const topDrugs = groupByField(allOrders, 'medicineName', 'count', 'medicine');

    // Top hospitals (from hospitalOrders)
    const topHospitals = groupByField(hospitalOrders, 'hospitalName', 'orders', 'hospital');

    // Top pharmacies (from pharmacyOrders)
    const topPharmacies = groupByField(pharmacyOrders, 'hospitalName', 'orders', 'pharmacy');

    return NextResponse.json({
      metrics: {
        totalOrders,
        avgDeliveryTime: avgDeliveryTime.toFixed(1),
        fulfillmentRate: `${fulfillmentRate}%`,
        lowStockIncidents: lowStock,
        expiredDrugs,
      },
      charts: {
        vendorOrders,
        topDrugs,
        topHospitals,
        topPharmacies,
      },
    });
  } catch (err) {
    console.error('Performance API error:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

// Helper functions

function getDateRange(filter: string) {
  const now = new Date();
  const start = new Date(now);

  switch (filter) {
    case 'weekly':
      start.setDate(now.getDate() - 7);
      break;
    case 'monthly':
      start.setMonth(now.getMonth() - 1);
      break;
    case 'yearly':
      start.setFullYear(now.getFullYear() - 1);
      break;
  }

  return { start, end: now };
}

function calculateAvgHours(orders: any[]) {
  if (!orders.length) return 0;

  const totalHours = orders.reduce((sum, order) => {
    const created = new Date(order.createdAt).getTime();
    const updated = new Date(order.updatedAt).getTime();
    return sum + (updated - created) / (1000 * 60 * 60); // hours
  }, 0);

  return totalHours / orders.length;
}

function groupByField(data: any[], field: string, valueKey: string, labelKeyOverride?: string) {
  const counts: Record<string, number> = {};

  for (const item of data) {
    const key = item[field];
    if (key) counts[key] = (counts[key] || 0) + 1;
  }

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([label, count]) => ({
      [labelKeyOverride || (
        field === 'medicineName' ? 'medicine' :
        field === 'hospitalName' ? 'hospital' :
        'vendor'
      )]: label,
      [valueKey]: count,
    }));
}
