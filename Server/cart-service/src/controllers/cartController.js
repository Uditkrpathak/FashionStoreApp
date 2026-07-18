import mongoose from 'mongoose';
import Address from '../models/Address.js';
import Coupon from '../models/Coupon.js';
import Cart from '../models/Cart.js';

// Connection to catalog database to validate client inputs and retrieve verified price/title/image
const catalogConn = mongoose.createConnection(
  process.env.MONGO_URI ? process.env.MONGO_URI.replace('fashion_cart', 'fashion_catalog') : 'mongodb://127.0.0.1:27017/fashion_catalog'
);

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String],
  sizes: [String],
  colors: [String],
});

const CatalogProduct = catalogConn.model('Product', ProductSchema);

const recalcCartTotals = (cart) => {
  cart.totalQty = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const getCart = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const { productId, variantSku, size, color, quantity = 1 } = req.body;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    // Fetch from official catalog DB — NEVER trust client price, title, or image
    const product = await CatalogProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found in catalog' });
    }

    // Validate size and color exist in catalog product
    if (size && !product.sizes.includes(size)) {
      return res.status(400).json({ success: false, message: `Invalid size selected. Available: ${product.sizes.join(', ')}` });
    }
    if (color && !product.colors.includes(color)) {
      return res.status(400).json({ success: false, message: `Invalid color selected. Available: ${product.colors.join(', ')}` });
    }

    const officialPrice = product.price;
    const officialTitle = product.title;
    const officialImage = product.images?.[0] || '';

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existingItemIndex = cart.items.findIndex(item => item.productId === productId && item.variantSku === variantSku);
    
    // Check available stock (limit to 10 max per SKU)
    const MAX_STOCK = 10;
    const currentQty = existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : 0;
    if (currentQty + qty > MAX_STOCK) {
      return res.status(400).json({ 
        success: false, 
        message: `Only ${MAX_STOCK} units of this item are available in stock. You already have ${currentQty} in cart.` 
      });
    }

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += qty;
      cart.items[existingItemIndex].price = officialPrice;
      cart.items[existingItemIndex].title = officialTitle;
      cart.items[existingItemIndex].image = officialImage;
    } else {
      cart.items.push({ 
        productId, 
        variantSku, 
        title: officialTitle, 
        image: officialImage, 
        price: officialPrice, 
        size, 
        color, 
        quantity: qty 
      });
    }
    
    recalcCartTotals(cart);
    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

export const updateCartQty = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const { productId, variantSku, quantity } = req.body;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.find(i => i.productId === productId && i.variantSku === variantSku);
    if (item) {
      // Check stock limit (limit to 10 max per SKU)
      const MAX_STOCK = 10;
      if (qty > MAX_STOCK) {
        return res.status(400).json({ success: false, message: `Only ${MAX_STOCK} units of this item are available in stock.` });
      }

      // Sync catalog values just in case
      const product = await CatalogProduct.findById(productId);
      if (product) {
        item.price = product.price;
        item.title = product.title;
        item.image = product.images?.[0] || '';
      }

      item.quantity = qty;
      recalcCartTotals(cart);
      await cart.save();
    }
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const { productId, variantSku } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(i => !(i.productId === productId && i.variantSku === variantSku));
    recalcCartTotals(cart);
    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      cart.coupon = undefined;
      recalcCartTotals(cart);
      await cart.save();
    }
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

export const seedCoupons = async (req, res, next) => {
  try {
    await Coupon.deleteMany();
    await Coupon.insertMany([
      { code: 'SAVE10', discountPercent: 10, discountType: 'percentage', discountValue: 10, isActive: true },
      { code: 'WELCOME20', discountPercent: 20, discountType: 'percentage', discountValue: 20, isActive: true },
      { code: 'FLAT50', discountPercent: 50, discountType: 'percentage', discountValue: 50, isActive: true },
      { code: 'WELCOME200', discountPercent: 50, discountType: 'percentage', discountValue: 50, isActive: true },
      { code: 'CASHBACK12', discountPercent: 10, discountType: 'fixed', discountValue: 100, isActive: true },
      { code: 'FEST2COST', discountPercent: 50, discountType: 'percentage', discountValue: 50, isActive: true },
    ]);
    res.json({ success: true, message: 'Coupons seeded' });
  } catch (err) {
    next(err);
  }
};

export const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    
    // Look up dynamic Coupon collection in DB
    const dbCoupon = await Coupon.findOne({ code, isActive: true });
    
    if (!dbCoupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    // Map into frontend expected object
    const coupon = {
      code: dbCoupon.code,
      discountType: dbCoupon.discountType || 'percentage',
      discountValue: dbCoupon.discountValue !== undefined ? dbCoupon.discountValue : dbCoupon.discountPercent,
      isActive: dbCoupon.isActive
    };

    res.json({ success: true, coupon });
  } catch (err) {
    next(err);
  }
};

export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ userId: req.headers['x-user-id'] });
    res.json({ success: true, addresses });
  } catch (err) {
    next(err);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    // Whitelist allowed fields to prevent overriding internal/administrative fields
    const { label, line1, line2, city, state, pincode, phone } = req.body;
    const address = new Address({
      userId: req.headers['x-user-id'],
      label,
      line1,
      line2,
      city,
      state,
      pincode,
      phone
    });
    await address.save();
    res.json({ success: true, address });
  } catch (err) {
    next(err);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    // Whitelist allowed fields to prevent overriding internal/administrative fields
    const { label, line1, line2, city, state, pincode, phone } = req.body;
    const updateData = {};
    if (label !== undefined) updateData.label = label;
    if (line1 !== undefined) updateData.line1 = line1;
    if (line2 !== undefined) updateData.line2 = line2;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (pincode !== undefined) updateData.pincode = pincode;
    if (phone !== undefined) updateData.phone = phone;

    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.headers['x-user-id'] },
      updateData,
      { new: true }
    );
    if (!address) return res.status(404).json({ success: false, message: 'Address not found' });
    res.json({ success: true, address });
  } catch (err) {
    next(err);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    await Address.findOneAndDelete({ _id: req.params.id, userId: req.headers['x-user-id'] });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
