import dbConnect from '@/lib/db/mongodborder';
import DeliveryLocation from '@/lib/models/DeliveryLocation';

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');

  const location = await DeliveryLocation.findOne({ orderId });
  return new Response(JSON.stringify(location), { status: 200 });
}