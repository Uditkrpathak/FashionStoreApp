import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    productId: String,
    variantSku: String,
    qty: Number,
    priceAtAdd: Number,
    title: String,
    image: String,
    color: String,
    size: String
  }],
  shippingAddress: Object,
  deliveryOption: Object,
  paymentMethod: Object,
  totals: {
    subtotal: Number,
    shipping: Number,
    discount: Number,
    grandTotal: Number
  },
  orderStatus: { type: String, default: 'placed', enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'] },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    reason: String
  }],
  razorpayOrderId: String,
  razorpayPaymentId: String,
  paymentStatus: { type: String, default: 'pending', enum: ['pending', 'completed', 'failed', 'refunded'] },
  paymentGateway: { type: String, default: 'razorpay' }
}, { timestamps: true });

OrderSchema.pre('save', function() {
  if (this.isNew) {
    this.statusHistory.push({ status: 'placed' });
  }
});

export default mongoose.model('Order', OrderSchema);
