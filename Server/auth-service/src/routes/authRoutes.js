import express from 'express';
import { login, register, getMe, updateProfile, verifyOtp, forgotPassword, resetPassword, addAddress, updateAddress, removeAddress, addToWishlist, removeFromWishlist, refreshToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);
router.get('/me', getMe);
router.patch('/profile', updateProfile);

// Addresses
router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', removeAddress);

// Wishlist
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

export default router;
