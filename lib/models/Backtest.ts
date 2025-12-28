import mongoose from 'mongoose';

const BacktestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  strategyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Strategy',
  },
  asset: String,
  timeframe: String,
  parameters: {
    type: Object,
    default: {},
  },
  results: {
    type: Object, // Summary metrics: winRate, totalPnl, etc.
    default: {},
  },
}, { timestamps: true });

export default mongoose.models.Backtest || mongoose.model('Backtest', BacktestSchema);
