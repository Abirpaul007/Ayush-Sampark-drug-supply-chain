// pages/api/admin-orders.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodborder";
import Order from "@/lib/models/orderh";
import PharmacyOrder from "@/lib/models/orderp";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const [hospitalOrders, pharmacyOrders] = await Promise.all([
      Order.find().lean(),
      PharmacyOrder.find().lean(),
    ]);
    return NextResponse.json({
      success: true,
      hospitalOrders,
      pharmacyOrders,
    });
  } catch (error) {
    console.error("[admin-orders] Error:", error);
    return NextResponse.json({ success: false, message: "Failed" }, { status: 500 });
  }
}
