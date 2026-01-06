import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomTradeOption extends Document {
  userId: string;
  fieldName: string; // e.g., 'dailyBias', 'sessions', 'marketEnvironment', etc.
  value: string;
  createdAt: Date;
}

const CustomTradeOptionSchema = new Schema<ICustomTradeOption>({
  userId: { type: String, required: true, index: true },
  fieldName: { type: String, required: true, index: true },
  value: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Compound index for efficient querying per user and field
CustomTradeOptionSchema.index({ userId: 1, fieldName: 1 });

// Ensure uniqueness per user + field + value combination
CustomTradeOptionSchema.index({ userId: 1, fieldName: 1, value: 1 }, { unique: true });

export default mongoose.models.CustomTradeOption || mongoose.model<ICustomTradeOption>('CustomTradeOption', CustomTradeOptionSchema);
