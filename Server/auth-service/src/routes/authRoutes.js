import express from 'express';
import { 
  login, register, getMe, updateProfile, verifyOtp, 
  forgotPassword, resetPassword, addAddress, updateAddress, 
  removeAddress, addToWishlist, removeFromWishlist, refreshToken,
  getAllUsers, getUserById, updateUserRole, toggleUserStatus, getAuditLogs
} from '../controllers/authController.js';
import { 
  validateRequest, loginRules, registerRules, verifyOtpRules, 
  forgotPasswordRules, resetPasswordRules, updateProfileRules, 
  addressRules, updateAddressRules, wishlistRules 
} from '../middleware/validation.js';
import { requireAdmin, requirePermission } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/login', loginRules, validateRequest, login);
router.post('/register', registerRules, validateRequest, register);
router.post('/verify-otp', verifyOtpRules, validateRequest, verifyOtp);
router.post('/forgot-password', forgotPasswordRules, validateRequest, forgotPassword);
router.post('/reset-password', resetPasswordRules, validateRequest, resetPassword);
router.post('/refresh-token', refreshToken);
router.get('/me', getMe);
router.patch('/profile', updateProfileRules, validateRequest, updateProfile);

// Addresses
router.post('/addresses', addressRules, validateRequest, addAddress);
router.put('/addresses/:addressId', updateAddressRules, validateRequest, updateAddress);
router.delete('/addresses/:addressId', removeAddress);

// Wishlist
router.post('/wishlist', wishlistRules, validateRequest, addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

// Admin User Management & Audit Routes
router.get('/admin/users', requireAdmin, requirePermission('users.view'), getAllUsers);
router.get('/admin/users/:id', requireAdmin, requirePermission('users.view'), getUserById);
router.patch('/admin/users/:id/role', requireAdmin, requirePermission('users.manage'), updateUserRole);
router.patch('/admin/users/:id/status', requireAdmin, requirePermission('users.block'), toggleUserStatus);
router.get('/admin/audit-logs', requireAdmin, requirePermission('audit.view'), getAuditLogs);

export default router;

