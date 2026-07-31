import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  jti: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String, required: true },
  userRole: { type: String, default: 'user' },
  ipAddress: { type: String, default: '127.0.0.1' },
  userAgent: { type: String, default: 'Unknown' },
  isValid: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('Session', SessionSchema);
