import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model('Coupon', CouponSchema);
