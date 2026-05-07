import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import dbConnect from '@/lib/db/mongodborder'
import { User } from '@/lib/models/User'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?._id) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 })
    }

    await dbConnect()
    await User.findByIdAndUpdate(session.user._id, { updatedAt: new Date() })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error('Error updating activity timestamp:', err)
    return new Response(JSON.stringify({ message: 'Failed to update activity' }), { status: 500 })
  }
}
