// pages/api/admin-orders.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import HospitalOrder from '@/lib/models/orderh'; // this is your Order.ts
import PharmacyOrder from '@/lib/models/orderp'; // this is your PharmacyOrder.ts

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const hospitalOrders = await HospitalOrder.find().lean();
    const pharmacyOrders = await PharmacyOrder.find().lean();

    const allOrders = [...hospitalOrders, ...pharmacyOrders];

    return NextResponse.json({ success: true, orders: allOrders });
  } catch (error) {
    console.error('[admin-orders] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
