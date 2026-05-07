// app/api/verification/apply/route.ts

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/db/mongodborder';
import { Verification } from '@/lib/models/Verification';
import { NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function uploadBufferToCloudinary(file: File, folder: string) {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const mimeType = file.type

  const isPDF = mimeType === 'application/pdf'
  const resourceType = isPDF ? 'raw' : 'auto'

  // Generate a safe unique filename
  const timestamp = Date.now()
  const originalName = file.name.split('.').slice(0, -1).join('-') || 'file'
  const publicId = `${folder}/${originalName}-${timestamp}${isPDF ? '.pdf' : ''}`

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder,
        public_id: publicId,
        use_filename: false,
        unique_filename: false,
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result?.secure_url || '')
      }
    )
    stream.end(buffer)
  })
}


export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?._id) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  await dbConnect();
  const formData = await req.formData();

  // Extract all required fields
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const designation = formData.get('designation') as string;
  const licenseNumber = formData.get('licenseNumber') as string;
  const licenseType = formData.get('licenseType') as string;
  const licenseIssuedBy = formData.get('licenseIssuedBy') as string;
  const organization = formData.get('organization') as string;

  const idProofFile = formData.get('idProofFile') as File | null;
  const licenseFile = formData.get('licenseCertificateFile') as File | null;
  const addressProofFile = formData.get('addressProofFile') as File | null;

  if (
    !name ||
    !email ||
    !phoneNumber ||
    !designation ||
    !licenseNumber ||
    !licenseType ||
    !licenseIssuedBy ||
    !organization
  ) {
    return new Response(JSON.stringify({ message: 'Missing required fields' }), {
      status: 400,
    });
  }

  try {
    const existing = await Verification.findOne({ userId: session.user._id });
    if (existing) {
      return new Response(
        JSON.stringify({ message: 'Verification already submitted' }),
        { status: 400 }
      );
    }

    const [idProofUrl, licenseUrl, addressProofUrl] = await Promise.all([
      idProofFile ? uploadBufferToCloudinary(idProofFile, 'verification/id-proof') : null,
      licenseFile ? uploadBufferToCloudinary(licenseFile, 'verification/license') : null,
      addressProofFile
        ? uploadBufferToCloudinary(addressProofFile, 'verification/address')
        : null,
    ]);

    const verification = await Verification.create({
      userId: session.user._id,
      fullName: name,
      email,
      phoneNumber,
      designation,
      licenseNumber,
      licenseType,
      licenseIssuedBy,
      organization,
      idProofUrl,
      licenseCertificateUrl: licenseUrl,
      addressProofUrl,
      applicationStatus: 'PENDING',
      submittedAt: new Date(),
    });

    return new Response(JSON.stringify({ success: true, data: verification }), {
      status: 201,
    });
  } catch (error) {
    console.error('Verification apply error:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}