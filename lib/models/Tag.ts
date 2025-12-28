import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#808080',
  },
  description: String,
}, { timestamps: true });

// Compound index to ensure unique tag names per user
TagSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.models.Tag || mongoose.model('Tag', TagSchema);
