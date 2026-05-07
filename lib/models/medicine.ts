// lib/models/medicine.ts

import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMedicine extends Document {
  userId: Types.ObjectId; // reference to User
  brandName: string;
  genericName: string;
  category: string;
  dosageForm: string;
  strength: string;
  packSize: string;
  licenseNumber: string;
  batchNumber: string;
  expiryDate: Date;
  manufacturingDate: Date;
  approvalNumber: string;
  mrp: number;
  offerPrice: number;
  gst: number;
  stockQuantity: number;
  minOrderQuantity: number;
  shortDescription: string;
  detailedDescription: string;
  productImage: string;
  packagingImage: string;
  labReports: string;
  storageConditions: string;
  shippingWeight: string;
  dimensions: string;
  brochure: string;
  msds: string;
  certifications: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MedicineSchema = new Schema<IMedicine>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    brandName: String,
    genericName: String,
    category: String,
    dosageForm: String,
    strength: String,
    packSize: String,
    licenseNumber: String,
    batchNumber: String,
    expiryDate: Date,
    manufacturingDate: Date,
    approvalNumber: String,
    mrp: Number,
    offerPrice: Number,
    gst: Number,
    stockQuantity: Number,
    minOrderQuantity: Number,
    shortDescription: String,
    detailedDescription: String,
    productImage: String,
    packagingImage: String,
    labReports: String,
    storageConditions: String,
    shippingWeight: String,
    dimensions: String,
    brochure: String,
    msds: String,
    certifications: String,
  },
  { timestamps: true }
);

export default mongoose.models.Medicine || mongoose.model<IMedicine>('Medicine', MedicineSchema);
