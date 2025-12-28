import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email for this user.'],
    unique: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password for this user.'],
  },

  settings: {
    type: Object,
    default: {},
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });


export default mongoose.models.User || mongoose.model('User', UserSchema);
