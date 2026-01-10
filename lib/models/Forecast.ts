import mongoose from 'mongoose';

const ForecastSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    index: true
  },
  analysis: {
    type: Object, // Stores the full AnalysisResult JSON
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Forecast || mongoose.model('Forecast', ForecastSchema);
