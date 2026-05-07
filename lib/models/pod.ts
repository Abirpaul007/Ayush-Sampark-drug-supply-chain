import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPod extends Document {
  hospitalUserId: Types.ObjectId;
  orderId: string;
  hospitalName: string;
  vendorId: string;
  podUrl: string;
  uploadedAt: Date;
}

const podSchema = new Schema<IPod>(
  {
    hospitalUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Hospital userId is required'],
    },
    orderId: {
      type: String,
      required: [true, 'Order ID is required'],
    },
    hospitalName: {
      type: String,
      required: [true, 'Hospital name is required'],
    },
    vendorId: {
      type: String,
      required: [true, 'Vendor ID is required'],
    },
    podUrl: {
      type: String,
      required: [true, 'POD URL is required'],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Pod || mongoose.model<IPod>('Pod', podSchema);
