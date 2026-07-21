import express from 'express';
import {
  seedCoupons, applyCoupon,
  getAddresses, addAddress, updateAddress, deleteAddress,
  getCart, addToCart, updateCartQty, removeFromCart, clearCart,
  getAllCoupons, createCoupon, updateCoupon, deleteCoupon
} from '../controllers/cartController.js';
import {
  validateRequest,
  addToCartRules,
  updateCartQtyRules,
  applyCouponRules,
  addressRules,
  updateAddressRules
} from '../middleware/validation.js';
import { requireAdmin, requirePermission } from '../middleware/adminMiddleware.js';

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

// Admin Coupon Routes
router.get('/admin/coupons', requireAdmin, requirePermission('settings.edit'), getAllCoupons);
router.post('/admin/coupons', requireAdmin, requirePermission('settings.edit'), createCoupon);
router.put('/admin/coupons/:id', requireAdmin, requirePermission('settings.edit'), updateCoupon);
router.delete('/admin/coupons/:id', requireAdmin, requirePermission('settings.edit'), deleteCoupon);

export default router;

