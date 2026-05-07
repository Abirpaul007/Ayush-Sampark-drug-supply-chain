import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import Feedback from '@/lib/models/feedback';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { message } = await req.json();
  if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

  await dbConnect();
  await Feedback.create({
    userId: session.user._id,
    message,
    role: session.user.role || 'pharmacy',
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
