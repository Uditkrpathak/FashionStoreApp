import express from 'express';
import {
  seedCoupons, applyCoupon,
  getAddresses, addAddress, updateAddress, deleteAddress,
  getCart, addToCart, updateCartQty, removeFromCart, clearCart
} from '../controllers/cartController.js';
import {
  validateRequest,
  addToCartRules,
  updateCartQtyRules,
  applyCouponRules,
  addressRules,
  updateAddressRules
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', getCart);
router.post('/items', addToCartRules, validateRequest, addToCart);
router.put('/items', updateCartQtyRules, validateRequest, updateCartQty);
router.delete('/items', removeFromCart);
router.delete('/', clearCart);

router.post('/seed', seedCoupons);
router.post('/coupon/apply', applyCouponRules, validateRequest, applyCoupon);
router.get('/addresses', getAddresses);
router.post('/addresses', addressRules, validateRequest, addAddress);
router.put('/addresses/:id', updateAddressRules, validateRequest, updateAddress);
router.patch('/addresses/:id', updateAddressRules, validateRequest, updateAddress);
router.delete('/addresses/:id', deleteAddress);

export default router;
