// lib/models/PharmacyOrder.ts

import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IDispatchedBatch {
  batchId: Types.ObjectId;
  batchNumber: string;
  expiryDate: Date;
  quantity: number;
  price: number;
}

export interface IPharmacyOrder extends Document {
  userId: Types.ObjectId; // reference to User
  orderId: string;
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' };
  medicineName: string;
  quantity: number;
  price: number;
  hospitalName: string;
  totalValue: number;
  deliveryDate: Date;
  orderDate: Date;
  manufacturerStatus: string;
  dispatchedBatches: IDispatchedBatch[];
}


const DispatchedBatchSchema = new Schema<IDispatchedBatch>({
  batchId: {
    type: Schema.Types.ObjectId,
    ref: 'VendorInventory',
    required: true,
  },
  batchNumber: String,
  expiryDate: Date,
  quantity: Number,
  price: Number,
});

const PharmacyOrderSchema = new Schema<IPharmacyOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: String,
    medicineId:{type: Schema.Types.ObjectId, ref: 'Medicine', required: true},
    medicineName: String,
    quantity: Number,
    price: Number,
    hospitalName: String,
    totalValue: Number,
    deliveryDate: Date,
    orderDate: Date,
    manufacturerStatus: {
      type: String,
      default: "Pending",
    },
    dispatchedBatches: [DispatchedBatchSchema],
  },
  { timestamps: true }
);

export default mongoose.models.PharmacyOrder || mongoose.model<IPharmacyOrder>('PharmacyOrder', PharmacyOrderSchema);
