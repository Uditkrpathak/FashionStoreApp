import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
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
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);
