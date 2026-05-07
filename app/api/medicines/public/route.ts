// /app/api/medicines/public/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import VendorInventory from '@/lib/models/Vendor-Inventory';
import Medicine from '@/lib/models/medicine';
import { User } from '@/lib/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();

  try {
    const today = new Date();

    const batches = await VendorInventory.find({
      stockQuantity: { $gt: 0 },
      expiryDate: { $gte: today },
    })
      .populate({
        path: 'medicineId',
        model: Medicine,
        select:
          'brandName genericName description strength form manufacturer storageConditions productImage dosageForm packSize licenseNumber',
      })
      .populate({
        path: 'userId',
        model: User,
        select: 'name',
      });

    const groupedMap = new Map();

    for (const batch of batches) {
      // ✅ Check if population succeeded
      if (!batch.medicineId || !batch.userId) {
        console.warn('Skipping batch due to missing populated fields:', batch._id);
        continue;
      }

      const key = `${batch.medicineId._id}-${batch.userId._id}`;
      const currentOffer = batch.offerPrice;
      const stockQty = batch.stockQuantity;

      const medicine = batch.medicineId;
      const vendor = batch.userId;

      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          _id: key,
          medicineId: medicine._id,
          vendorId: vendor._id,
          brandName: medicine.brandName,
          genericName: medicine.genericName,
          vendorName: vendor.name,
          minOfferPrice: currentOffer,
          totalStock: stockQty,
          mrp: batch.mrp,
          productImage: medicine.productImage || null,
          description: medicine.description || '',
          strength: medicine.strength || '',
          form: medicine.form || '',
          dosageForm: medicine.dosageForm || '',
          manufacturer: medicine.manufacturer || '',
          packSize: medicine.packSize || '',
          licenseNumber: medicine.licenseNumber || '',
          storageConditions: medicine.storageConditions || '',
        });
      } else {
        const existing = groupedMap.get(key);
        existing.totalStock += stockQty;
        if (currentOffer < existing.minOfferPrice) {
          existing.minOfferPrice = currentOffer;
        }
      }
    }

    return NextResponse.json(Array.from(groupedMap.values()), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
