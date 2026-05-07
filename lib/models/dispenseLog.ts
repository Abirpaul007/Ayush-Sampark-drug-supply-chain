// lib/models/dispenseLog.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IDispensedFrom {
  orderId: Types.ObjectId;
  batchId: Types.ObjectId;
  batchNumber: string;
  usedQuantity: number;
}

export interface IDispenseLog extends Document {
  hospitalId: Types.ObjectId;
  medicineId: Types.ObjectId;
  quantity: number;
  dispensedFrom: IDispensedFrom[];
  recipient: string;
  dispensedAt: Date;
}

const DispensedFromSchema = new Schema<IDispensedFrom>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: false },
  batchId: { type: Schema.Types.ObjectId, required: false },
  batchNumber: { type: String, required: true },
  usedQuantity: { type: Number, required: true }
});

const DispenseLogSchema = new Schema<IDispenseLog>({
  hospitalId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
  quantity: { type: Number, required: true },
  dispensedFrom: { type: [DispensedFromSchema], required: true },
  recipient: { type: String, required: true },
  dispensedAt: { type: Date, default: Date.now }
});

// Important: Always clear model from cache in development to avoid outdated schema
export default mongoose.models.DispenseLog ??
  mongoose.model<IDispenseLog>('DispenseLog', DispenseLogSchema);
