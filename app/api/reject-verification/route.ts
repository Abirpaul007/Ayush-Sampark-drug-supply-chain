import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongodborder'
import { Verification } from '@/lib/models/Verification'

export async function POST(req: Request) {
  try {
    await dbConnect()

    const { userId } = await req.json()

    const updated = await Verification.findOneAndUpdate(
      { userId },
      { applicationStatus: 'REJECTED' },
      { new: true }
    )

    if (!updated) {
      return NextResponse.json({ message: 'Verification record not found.' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in rejecting verification:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
