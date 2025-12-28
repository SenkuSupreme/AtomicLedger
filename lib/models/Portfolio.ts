
import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  accountType: {
    type: String,
    enum: ['Live', 'Evaluation', 'Backtest', 'Funded'],
    default: 'Live',
  },
  initialBalance: {
    type: Number,
    default: 0,
  },
  currentBalance: {
    type: Number,
    default: 0,
  },
  goal: {
    type: Number,
    default: 0,
  },
  deposits: {
    type: Number,
    default: 0,
  },
  withdrawals: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Compound index to ensure unique portfolio names per user
PortfolioSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);
