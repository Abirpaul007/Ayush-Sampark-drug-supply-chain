import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import Order from '@/lib/models/orderh';
import PharmacyOrder from '@/lib/models/orderp';
import Medicine from '@/lib/models/medicine';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const period = req.nextUrl.searchParams.get('period') || 'monthly'; // 'monthly' or 'yearly'
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-based

  // Get all medicines for this vendor
  const vendorMedicines = await Medicine.find({ userId: user._id }).select('_id');
  const medicineIds = vendorMedicines.map((med) => med._id);

  // Fetch all orders for this vendor for the current year
  const [hospitalOrders, pharmacyOrders] = await Promise.all([
    Order.find({
      medicineId: { $in: medicineIds },
      orderDate: { $gte: new Date(currentYear, 0, 1), $lte: new Date(currentYear, 11, 31, 23, 59, 59, 999) },
    }),
    PharmacyOrder.find({
      medicineId: { $in: medicineIds },
      orderDate: { $gte: new Date(currentYear, 0, 1), $lte: new Date(currentYear, 11, 31, 23, 59, 59, 999) },
    }),
  ]);
  const allOrders = [...hospitalOrders, ...pharmacyOrders];

  if (period === 'monthly') {
    // Count orders per month for the current year, up to the current month
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const orderCounts: { [month: string]: number } = {};
    for (let i = 0; i <= currentMonth; i++) {
      orderCounts[months[i]] = 0;
    }
    allOrders.forEach(order => {
      const date = new Date(order.orderDate);
      if (date.getFullYear() === currentYear && date.getMonth() <= currentMonth) {
        const monthName = months[date.getMonth()];
        if (orderCounts[monthName] !== undefined) {
          orderCounts[monthName]++;
        }
      }
    });
    return NextResponse.json({
      x: months.slice(0, currentMonth + 1),
      y: months.slice(0, currentMonth + 1).map(m => orderCounts[m]),
      period: 'monthly',
    });
  } else if (period === 'yearly') {
    // Count orders per year, from current year onward (future years only if orders exist)
    const yearsSet = new Set<number>();
    allOrders.forEach(order => {
      const date = new Date(order.orderDate);
      if (date.getFullYear() >= currentYear) {
        yearsSet.add(date.getFullYear());
      }
    });
    const years = Array.from(yearsSet).sort();
    // If no orders for future years, just show current year
    if (years.length === 0) years.push(currentYear);
    const orderCounts: { [year: number]: number } = {};
    years.forEach(y => orderCounts[y] = 0);
    allOrders.forEach(order => {
      const date = new Date(order.orderDate);
      if (orderCounts[date.getFullYear()] !== undefined) {
        orderCounts[date.getFullYear()]++;
      }
    });
    return NextResponse.json({
      x: years.map(String),
      y: years.map(y => orderCounts[y]),
      period: 'yearly',
    });
  }
  return NextResponse.json({ error: 'Invalid period' }, { status: 400 });
} 