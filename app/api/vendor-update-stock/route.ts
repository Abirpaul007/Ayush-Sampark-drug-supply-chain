import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import VendorInventory from '@/lib/models/Vendor-Inventory';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'VENDOR') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      'medicineId',
      'batchNumber',
      'expiryDate',
      'manufacturingDate',
      'stockQuantity',
      'mrp'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Parse numeric fields
    const numericFields = {
      stockQuantity: parseInt(body.stockQuantity),
      mrp: parseFloat(body.mrp),
      offerPrice: body.offerPrice ? parseFloat(body.offerPrice) : parseFloat(body.price)
    };

    // Validate numeric values
    for (const [field, value] of Object.entries(numericFields)) {
      if (isNaN(value)) {
        return NextResponse.json(
          { message: `Invalid value for ${field}` },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData = {
      userId: session.user._id,
      medicineId: body.medicineId,
      batchNumber: body.batchNumber,
      expiryDate: new Date(body.expiryDate),
      manufacturingDate: new Date(body.manufacturingDate),
      stockQuantity: numericFields.stockQuantity,
      mrp: numericFields.mrp,
      offerPrice: numericFields.offerPrice
    };

    console.log(updateData);

    // Perform upsert
    const batch = await VendorInventory.findOneAndUpdate(
      {
        userId: session.user._id,
        medicineId: body.medicineId,
        batchNumber: body.batchNumber,
      },
      updateData,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({ 
      message: '✅ Stock updated successfully.', 
      batch 
    });
  } catch (error: any) {
    console.error('❌ Error updating stock:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}