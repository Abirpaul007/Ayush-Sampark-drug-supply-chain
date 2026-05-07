import mongoose from 'mongoose';

const DeliveryLocationSchema = new mongoose.Schema({
  orderId: String,
  address: String,
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.DeliveryLocation || mongoose.model('DeliveryLocation', DeliveryLocationSchema);
