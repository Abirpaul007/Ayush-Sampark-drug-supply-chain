// /lib/models/PharmacyInventory.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

interface Batch {
  batchNumber: string;
  quantity: number;
  expiryDate: Date;
}

export interface IPharmacyInventory extends Document {
  hospitalId: Types.ObjectId;
  medicineId: Types.ObjectId;
  totalStock: number;
  lastOrderedDate: Date;
  batches: Batch[];
}

const pharmacyInventorySchema = new Schema<IPharmacyInventory>({
  hospitalId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
  totalStock: { type: Number, default: 0 },
  lastOrderedDate: { type: Date },
  batches: [
    {
      batchNumber: String,
      quantity: Number,
      expiryDate: Date,
    },
  ],
});

export default mongoose.models.PharmacyInventory ||
  mongoose.model<IPharmacyInventory>('PharmacyInventory', pharmacyInventorySchema);
