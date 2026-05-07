import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodborder'
import { User } from '@/lib/models/User'
import { Verification } from '@/lib/models/Verification'

export async function GET() {
  try {
    await dbConnect()

    // Step 1: Find all approved verifications
    const approvedVerifications = await Verification.find({ applicationStatus: 'APPROVED' }).lean()

    // Step 2: Extract userIds of approved verifications
    const approvedUserIds = approvedVerifications.map(v => v.userId.toString())

    // Step 3: Find users whose _id matches approvedUserIds
    const users = await User.find({ _id: { $in: approvedUserIds } }).select('-password -otp').lean()

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching approved users:', error)
    return NextResponse.json({ error: 'Failed to fetch approved users' }, { status: 500 })
  }
}
