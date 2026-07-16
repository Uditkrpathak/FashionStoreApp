import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  role: { type: String, default: 'user' },
  otp: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },
  
  // Profile fields
  avatar: String,
  dob: Date,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  location: String,
  
  // Addresses
  addresses: [{
    label: { type: String, enum: ['Home', 'Work', 'Other'] },
    name: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: { type: Boolean, default: false }
  }],

  // Saved Cards (Mock tokenized)
  savedCards: [{
    last4: String,
    brand: String,
    expMonth: Number,
    expYear: Number,
    token: String
  }],

  // Wishlist (Array of Product IDs)
  wishlist: [String]
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
