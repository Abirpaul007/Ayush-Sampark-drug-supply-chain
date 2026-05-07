import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import { Verification } from '@/lib/models/Verification';
import { User } from '@/lib/models/User';

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';

  const query: any = { applicationStatus: 'PENDING' };

  if (search) {
    query.$or = [
      { licenseNumber: { $regex: search, $options: 'i' } },
      { organization: { $regex: search, $options: 'i' } },
    ];
  }

  try {
    const total = await Verification.countDocuments(query);
    const pendingVerifications = await Verification
      .find(query)
      .populate('userId')
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({ success: true, data: pendingVerifications, total });
  } catch (error) {
    console.error('Error fetching pending verifications:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
