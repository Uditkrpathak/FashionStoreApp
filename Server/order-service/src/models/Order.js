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
    reason: String,
    actorId: String
  }],
  slaDeadline: Date,
  shipmentDetails: {
    courierName: String,
    trackingNumber: String,
    trackingUrl: String,
    shippedAt: Date,
    trackingEvents: [{
      status: String,
      location: String,
      timestamp: { type: Date, default: Date.now },
      description: String
    }]
  },
  returnRequest: {
    status: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
    reason: String,
    returnType: { type: String, enum: ['refund', 'replacement'], default: 'refund' },
    replacementOrderId: String,
    requestedAt: Date,
    processedAt: Date,
    adminNotes: String
  },
  creditNoteId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  paymentStatus: { type: String, default: 'pending', enum: ['pending', 'completed', 'failed', 'refunded'] },
  paymentGateway: { type: String, default: 'razorpay' }
}, { timestamps: true });

OrderSchema.pre('save', function() {
  if (this.isNew) {
    if (!this.statusHistory || this.statusHistory.length === 0) {
      this.statusHistory.push({ status: 'placed', reason: 'Order placed by customer' });
    }
    if (!this.slaDeadline) {
      // Set SLA Deadline to 24 hours after creation by default
      this.slaDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
  }
});

export default mongoose.model('Order', OrderSchema);
