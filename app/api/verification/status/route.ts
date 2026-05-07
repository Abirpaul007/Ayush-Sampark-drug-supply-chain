// /api/verification/status.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import dbConnect from '@/lib/db/mongodborder'
import { Verification } from '@/lib/models/Verification'
import type { IVerification } from '@/lib/models/Verification'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?._id) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }), 
        { status: 401 }
      )
    }

    await dbConnect()

    // Find the verification document
    const verification = await Verification.findOne({ 
      userId: session.user._id 
    })

    if (!verification) {
      return new Response(
        JSON.stringify({ 
          hasApplied: false,
          message: 'No verification application found'
        }), 
        { status: 404 }
      )
    }

    // Convert to plain object and ensure all fields are included
    const verificationData = verification.toObject() as IVerification

    // Prepare response data with all required fields
    const responseData = {
      hasApplied: true,
      applicationStatus: verificationData.applicationStatus,
      name: verificationData.fullName,
      email: verificationData.email,
      phoneNumber: verificationData.phoneNumber,
      designation: verificationData.designation,
      licenseNumber: verificationData.licenseNumber,
      licenseType: verificationData.licenseType,
      licenseIssuedBy: verificationData.licenseIssuedBy,
      organization: verificationData.organization,
      idProofUrl: verificationData.idProofUrl,
      licenseCertificateUrl: verificationData.licenseCertificateUrl,
      addressProofUrl: verificationData.addressProofUrl || null,
      submittedAt: verificationData.submittedAt.toISOString(),
      reviewedAt: (verificationData as any).reviewedAt?.toISOString() || null,
      createdAt: (verificationData as any).createdAt.toISOString(),
      updatedAt: (verificationData as any).updatedAt.toISOString()
    }

    return new Response(
      JSON.stringify(responseData), 
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in verification status endpoint:', error)
    return new Response(
      JSON.stringify({ message: 'Internal server error' }), 
      { status: 500 }
    )
  }
}