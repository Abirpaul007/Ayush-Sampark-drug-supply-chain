// /app/api/verification/all/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodborder';
import { User } from '@/lib/models/User';
import { Verification } from '@/lib/models/Verification';

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find().lean();

    const userRequests = await Promise.all(
      users.map(async (user) => {
        const verification = await Verification.findOne({ userId: user._id }).lean();

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          organization: user.organization,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isVerified: user.isVerified,
          verification,
        };
      })
    );

    return NextResponse.json(userRequests, { status: 200 });
  } catch (error) {
    console.error('[USER_REQUESTS_API_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch user requests' }, { status: 500 });
  }
}
