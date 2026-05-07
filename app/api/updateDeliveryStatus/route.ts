import dbConnect from '@/lib/db/mongodborder';
import Order from '@/lib/models/orderh';
import PharmacyOrder from '@/lib/models/orderp';

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();
  const { orderId, orderType } = body;

  let updatedOrder;

  if (orderType === 'Hospital') {
    updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { manufacturerStatus: 'Out For Delivery' },
      { new: true }
    );
  } else if (orderType === 'Pharmacy') {
    updatedOrder = await PharmacyOrder.findOneAndUpdate(
      { orderId },
      { manufacturerStatus: 'Out For Delivery' },
      { new: true }
    );
  }

  if (!updatedOrder) {
    return Response.json({ message: 'Order not found' }, { status: 404 });
  }

  return Response.json(updatedOrder, { status: 200 });
}
