import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  variantSku: { type: String, required: true },
  title: { type: String },
  image: { type: String },
  price: { type: Number, required: true },
  size: { type: String },
  color: { type: String },
  quantity: { type: Number, required: true, default: 1 }
});

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [CartItemSchema],
  totalQty: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  coupon: {
    code: { type: String },
    discount: { type: Number },
    type: { type: String, default: 'percent' }
  }
}, { timestamps: true });

export default mongoose.model('Cart', CartSchema);
