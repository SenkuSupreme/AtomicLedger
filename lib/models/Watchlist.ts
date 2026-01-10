import mongoose from 'mongoose';

const WatchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
  },
  type: {
    type: String, // 'STOCK', 'FOREX', 'COMMODITY', 'CRYPTO'
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Compound index to prevent duplicates per user
WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export default mongoose.models.Watchlist || mongoose.model('Watchlist', WatchlistSchema);
