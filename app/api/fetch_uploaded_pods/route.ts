// /app/api/fetch_uploaded_pods/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import Pod from '@/lib/models/pod';

export async function GET() {
  try {
    await dbConnect();
    const pods = await Pod.find({}, 'orderId');
    return NextResponse.json(pods);
  } catch (err) {
    console.error('Fetch PODs error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
