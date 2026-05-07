import dbConnect from '@/lib/db/mongodborder';
import DeliveryLocation from '@/lib/models/DeliveryLocation';

export async function POST(req: Request) {
  await dbConnect();
  const { orderId, address } = await req.json();

  let existing = await DeliveryLocation.findOne({ orderId });

  if (existing) {
    existing.address = address;
    existing.updatedAt = new Date();
    await existing.save();
  } else {
    await DeliveryLocation.create({ orderId, address });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}