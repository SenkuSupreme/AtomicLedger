import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email for this user.'],
    unique: true,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
  },
  image: {
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
  lastUsernameChange: Date,
}, { timestamps: true });


// Force clearing the model from cache to ensure schema updates are applied
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User = mongoose.model('User', UserSchema);
export default User;
