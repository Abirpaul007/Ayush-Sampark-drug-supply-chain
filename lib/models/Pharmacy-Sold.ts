// /lib/models/Pharmacy-Sold.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

interface DispensedFrom {
  batchId: Types.ObjectId;
  batchNumber: string;
  quantity: number;
}

export interface IPharmacySoldLog extends Document {
  pharmacyId: Types.ObjectId;
  medicineId: Types.ObjectId;
  quantity: number;
  saleDate: Date;
  dispensedFrom: DispensedFrom[];
}

const soldLogSchema = new Schema<IPharmacySoldLog>({
  pharmacyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
  quantity: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
  dispensedFrom: [
    {
      batchId: { type: Schema.Types.ObjectId, required: true },
      batchNumber: String,
      quantity: Number,
    },
  ],
});

export default mongoose.models.PharmacySoldLog ||
  mongoose.model<IPharmacySoldLog>('PharmacySoldLog', soldLogSchema);
