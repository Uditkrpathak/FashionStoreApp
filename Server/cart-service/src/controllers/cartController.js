import Address from '../models/Address.js';
import Coupon from '../models/Coupon.js';
import Cart from '../models/Cart.js';

const recalcCartTotals = (cart) => {
  cart.totalQty = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const getCart = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { productId, variantSku, title, image, price, size, color, quantity = 1 } = req.body;
    
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existingItemIndex = cart.items.findIndex(item => item.productId === productId && item.variantSku === variantSku);
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, variantSku, title, image, price, size, color, quantity });
    }
    
    recalcCartTotals(cart);
    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCartQty = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { productId, variantSku, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.find(i => i.productId === productId && i.variantSku === variantSku);
    if (item) {
      item.quantity = Math.max(1, quantity);
      recalcCartTotals(cart);
      await cart.save();
    }
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { productId, variantSku } = req.body; // or params, but let's use body for consistency or multiple deletes

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(i => !(i.productId === productId && i.variantSku === variantSku));
    recalcCartTotals(cart);
    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const clearCart = async (req, res) => {
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
    res.status(500).json({ success: false, message: err.message });
  }
};

export const seedCoupons = async (req, res) => {
  try {
    await Coupon.deleteMany();
    await Coupon.insertMany([
      { code: 'SAVE10', discountPercent: 10 },
      { code: 'WELCOME20', discountPercent: 20 },
      { code: 'FLAT50', discountPercent: 50 },
    ]);
    res.json({ success: true, message: 'Coupons seeded' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const mockCoupons = {
      'SAVE10': { code: 'SAVE10', discountType: 'percentage', discountValue: 10, isActive: true },
      'WELCOME20': { code: 'WELCOME20', discountType: 'percentage', discountValue: 20, isActive: true },
      'FLAT50': { code: 'FLAT50', discountType: 'percentage', discountValue: 50, isActive: true },
    };
    const coupon = mockCoupons[code];
    
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    res.json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.headers['x-user-id'] });
    res.json({ success: true, addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const address = new Address({ ...req.body, userId: req.headers['x-user-id'] });
    await address.save();
    res.json({ success: true, address });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.headers['x-user-id'] },
      req.body,
      { new: true }
    );
    if (!address) return res.status(404).json({ success: false, message: 'Address not found' });
    res.json({ success: true, address });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    await Address.findOneAndDelete({ _id: req.params.id, userId: req.headers['x-user-id'] });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
