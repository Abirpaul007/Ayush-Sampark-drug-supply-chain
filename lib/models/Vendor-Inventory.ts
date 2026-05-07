import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVendorInventory extends Document {
  userId: Types.ObjectId;
  medicineId: Types.ObjectId;
  batchNumber: string;
  expiryDate: Date;
  manufacturingDate: Date;
  stockQuantity: number;
  mrp: number;
  offerPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const VendorInventorySchema = new Schema<IVendorInventory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    medicineId: {
      type: Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true,
    },
    batchNumber: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    manufacturingDate: {
      type: Date,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    mrp: {
      type: Number,
      required: true,
    //   default: 0,  // Add default value
    },
    offerPrice: {
      type: Number,
      required: true,
    //   default: function() {  // Set default to price if not provided
    //     return this.mrp;
    //   },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.VendorInventory ||
  mongoose.model<IVendorInventory>('VendorInventory', VendorInventorySchema);