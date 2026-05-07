import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import mongoose from 'mongoose';
import HospitalInventory from '@/lib/models/Hospital-Inventory';
import DispenseLog from '@/lib/models/dispenseLog';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !user._id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { medicineId, quantity, recipient } = await req.json();

    if (
      !medicineId ||
      !mongoose.Types.ObjectId.isValid(medicineId) ||
      quantity <= 0 ||
      !recipient?.trim()
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const inventory = await HospitalInventory.findOne({
      hospitalId: user._id,
      medicineId: medicineId,
    });

    if (!inventory || inventory.totalStock< quantity) {
      return NextResponse.json({ error: `Insufficient stock. Available: ${inventory?.totalStock || 0}` },
        { status: 400 });
    }

    // Filter only non-expired batches
    const today = new Date();
    const validBatches = inventory.batches
      .filter((batch: any) => new Date(batch.expiryDate) >= today && batch.quantity > 0)
      .sort((a: any, b: any) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()); // optional: use earliest expiry first

    let remaining = quantity;
    const updatedBatches = [];
    const dispensedFrom = [];

    for (const batch of validBatches) {
      if (remaining <= 0) break;

      const usedQty = Math.min(batch.quantity, remaining);
      batch.quantity -= usedQty;
      remaining -= usedQty;

      dispensedFrom.push({
        batchNumber: batch.batchNumber,
        usedQuantity: usedQty,
      });

      updatedBatches.push(batch);
    }

    if (remaining > 0) {
      return NextResponse.json(
        { error: 'Insufficient stock in valid batches' },
        { status: 400 }
      );
    }

    // Update total stock
    inventory.totalStock = inventory.batches.reduce((sum: number, b: any) => sum + b.quantity, 0);
    await inventory.save();

    // Save dispense log
    await DispenseLog.create({
      hospitalId: user._id,
      medicineId,
      quantity,
      recipient,
      dispensedFrom, // optional: logs batch-level used quantities
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DISPENSE_DRUGS_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
