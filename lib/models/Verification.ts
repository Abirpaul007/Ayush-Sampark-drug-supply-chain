// lib/models/Verification.ts
import mongoose, { Schema, Document, models } from 'mongoose'

export interface IVerification extends Document {
  userId: mongoose.Types.ObjectId
  fullName: string
  email: string
  phoneNumber: string
  designation: string
  licenseNumber: string
  licenseType: string
  licenseIssuedBy: string
  organization: string
  idProofUrl?: string
  licenseCertificateUrl?: string
  addressProofUrl?: string
  applicationStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  submittedAt: Date
}

const VerificationSchema = new Schema<IVerification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    designation: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    licenseType: { type: String, required: true },
    licenseIssuedBy: { type: String, required: true },
    organization: { type: String, required: true },
    idProofUrl: { type: String },
    licenseCertificateUrl: { type: String },
    addressProofUrl: { type: String },
    applicationStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    submittedAt: { type: Date, required: true },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
)

export const Verification =
  models.Verification || mongoose.model<IVerification>('Verification', VerificationSchema)
