import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  productId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId:         { type: String, required: true },
  rating:         { type: Number, required: true, min: 1, max: 5 },
  comment:        { type: String, maxlength: 500, default: '' },
  userName:       { type: String },                                          // cached for display
  status:         { type: String, enum: ['active', 'hidden', 'deleted'], default: 'active' },
  verifiedPurchase: { type: Boolean, default: false },                       // true if user has delivered order for product
  helpfulCount:   { type: Number, default: 0 },
  reportedCount:  { type: Number, default: 0 },
}, { timestamps: true });

// Compound index: one review per user per product
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Review', ReviewSchema);
