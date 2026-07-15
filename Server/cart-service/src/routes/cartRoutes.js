import express from 'express';
import { 
  seedCoupons, applyCoupon, 
  getAddresses, addAddress, updateAddress, deleteAddress,
  getCart, addToCart, updateCartQty, removeFromCart, clearCart
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items', updateCartQty);
router.delete('/items', removeFromCart);
router.delete('/', clearCart);

router.post('/seed', seedCoupons);
router.post('/coupon/apply', applyCoupon);
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.patch('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

export default router;
