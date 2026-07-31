import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sku: { type: String, unique: true, sparse: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [String],
  sizes: [String],
  colors: [String],
  description: String,
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  brand: String,
  gender: String,
  isFeatured: { type: Boolean, default: false },
  isHidden: { type: Boolean, default: false },
  stock: { type: Number, default: 50 },
  lowStockThreshold: { type: Number, default: 5 },
  version: { type: Number, default: 1 }
}, { timestamps: true });

ProductSchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = 'PRD-' + Math.floor(100000 + Math.random() * 900000);
  }
  next();
});

export default mongoose.model('Product', ProductSchema);
