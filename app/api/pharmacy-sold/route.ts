import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db/mongodborder";
import mongoose from "mongoose";
import PharmacyInventory from "@/lib/models/Pharmacy-Inventory";
import PharmacySoldLog from "@/lib/models/Pharmacy-Sold";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || user.role !== "PHARMACY" || !user._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { medicineId, quantity } = await req.json();

    if (
      !medicineId ||
      !mongoose.Types.ObjectId.isValid(medicineId) ||
      quantity <= 0
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const inventory = await PharmacyInventory.findOne({
      hospitalId: user._id,
      medicineId,
    });

    if (!inventory || inventory.totalStock < quantity) {
      return NextResponse.json(
        {
          error: `Insufficient stock. Available: ${inventory?.totalStock || 0}`,
        },
        { status: 400 }
      );
    }

    // Define batch type
    type Batch = {
      _id: mongoose.Types.ObjectId;
      batchNumber: string;
      expiryDate: string | Date;
      quantity: number;
    };

    // Filter valid (non-expired) batches
    const today = new Date();
    const validBatches = (inventory.batches as Batch[])
      .filter(
        (batch: Batch) => new Date(batch.expiryDate) >= today && batch.quantity > 0
      )
      .sort(
        (a: Batch, b: Batch) =>
          new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
      );

    let remaining = quantity;
    const dispensedFrom: any[] = [];

    for (const batch of validBatches) {
      if (remaining <= 0) break;

      const usedQty = Math.min(batch.quantity, remaining);
      batch.quantity -= usedQty;
      remaining -= usedQty;

      dispensedFrom.push({
        batchId: batch._id,
        batchNumber: batch.batchNumber,
        quantity: usedQty,
      });
    }

    if (remaining > 0) {
      return NextResponse.json(
        { error: "Insufficient stock in valid batches" },
        { status: 400 }
      );
    }

    // Update total stock
    inventory.totalStock = (inventory.batches as Batch[]).reduce(
      (sum: number, b: Batch) => sum + b.quantity,
      0
    );
    await inventory.save();

    // Save sold log
    await PharmacySoldLog.create({
      pharmacyId: user._id,
      medicineId,
      quantity,
      dispensedFrom,
      saleDate: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PHARMACY_SOLD_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
