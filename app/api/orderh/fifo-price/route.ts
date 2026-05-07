// app/api/orderh/fifo-price/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import VendorInventory from '@/lib/models/Vendor-Inventory';

export async function GET(req: NextRequest) {
  await dbConnect();

  const url = new URL(req.url);
  const medicineId = url.searchParams.get('medicineId');
  const quantity = parseInt(url.searchParams.get('quantity') || '0');
  console.log("Ami er vitor");
  if (!medicineId || quantity <= 0) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    const today = new Date();
    const batches = await VendorInventory.find({
      medicineId,
      expiryDate: { $gte: today },
      stockQuantity: { $gt: 0 },
    })
      .sort({ expiryDate: 1 })
      .lean();

    let remainingQty = quantity;
    let totalPrice = 0;

    for (const batch of batches) {
      if (remainingQty <= 0) break;

      const usedQty = Math.min(batch.stockQuantity, remainingQty);
      totalPrice += usedQty * batch.offerPrice;
      remainingQty -= usedQty;
    }

    if (remainingQty > 0) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    return NextResponse.json({ totalPrice }, { status: 200 });
  } catch (err) {
    console.error('[FIFO_PRICE_API_ERROR]', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
