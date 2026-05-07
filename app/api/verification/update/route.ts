import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import { Verification } from '@/lib/models/Verification';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { verificationId, status } = await req.json();

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const updated = await Verification.findByIdAndUpdate(
      verificationId,
      { applicationStatus: status, reviewedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Verification not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating verification:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
