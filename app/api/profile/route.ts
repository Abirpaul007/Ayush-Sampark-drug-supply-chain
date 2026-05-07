// /app/api/profile/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options' // adjust path if needed
import dbConnect from '@/lib/db/mongodborder'
import { User } from '@/lib/models/User'
import { Verification } from '@/lib/models/Verification'

export async function GET() {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await User.findOne({ email: session.user.email }).select('-password')
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const verification = await Verification.findOne({ userId: user._id })

  return NextResponse.json({
    user,
    verification,
  })
}
