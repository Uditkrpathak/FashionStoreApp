import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  productCount: { type: Number, default: 0 }
});

export default mongoose.model('Category', CategorySchema);
