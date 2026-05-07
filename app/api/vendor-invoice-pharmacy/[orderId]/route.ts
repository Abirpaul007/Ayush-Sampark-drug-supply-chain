// app/api/vendor-invoice/[orderId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import PharmacyOrder from '@/lib/models/orderp';
import Medicine from '@/lib/models/medicine';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { orderId } = params;

  try {
    const order = await PharmacyOrder.findOne({
      orderId,
      manufacturerStatus: 'Delivered',
    }).populate({
      path: 'medicineId',
      model: Medicine,
      select: 'brandName userId',
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const med: any = order.medicineId;
    if (!med || med.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const quantity = order.quantity || 0;
    const totalPrice = order.dispatchedBatches?.reduce(
      (sum: number, b: any) => sum + b.price * b.quantity,
      0
    ) || 0;

    const unitPrice = quantity > 0 ? totalPrice / quantity : 0;
    const total = quantity * unitPrice;

    const invoice = {
      invoiceNumber: `INV-${order.orderId}`,
      generatedAt: new Date().toLocaleDateString('en-GB'),
      vendor: {
        name: user.name,
        email: user.email,
        address: (user as any).address || 'Not Provided',
      },
      order: {
        orderId: order.orderId,
        hospital: order.hospitalName || 'Unknown',
        medicineName: med?.brandName || 'Unknown',
        quantity,
        pricePerUnit: parseFloat(unitPrice.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      },
    };

    return NextResponse.json(invoice);
  } catch (err) {
    console.error('[SINGLE_ORDER_INVOICE_ERROR]', err);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}
