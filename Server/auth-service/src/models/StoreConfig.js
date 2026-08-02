import mongoose from 'mongoose';

const StoreConfigSchema = new mongoose.Schema({
  storeName: { type: String, default: 'FashionStore' },
  supportEmail: { type: String, default: 'support@fashionstore.com' },
  supportPhone: { type: String, default: '+1-800-555-0199' },
  currency: { type: String, default: 'INR' },
  taxRatePercent: { type: Number, default: 18 },
  flatShippingFee: { type: Number, default: 100 },
  freeShippingThreshold: { type: Number, default: 1000 },
  featureToggles: {
    couponsEnabled: { type: Boolean, default: true },
    returnsEnabled: { type: Boolean, default: true },
    codPaymentEnabled: { type: Boolean, default: true },
    reviewsAllowed: { type: Boolean, default: true },
    instantRefundsEnabled: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false }
  },
  version: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.model('StoreConfig', StoreConfigSchema);
