import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  message: string;
  rating: number;
  createdAt: Date;
}

const feedbackSchema = new Schema<IFeedback>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.models?.Feedback || mongoose.model<IFeedback>('Feedback', feedbackSchema);

export default Feedback;
