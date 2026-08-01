import express from 'express';
import { 
  login, register, getMe, updateProfile, verifyOtp, 
  forgotPassword, resetPassword, addAddress, updateAddress, 
  removeAddress, addToWishlist, removeFromWishlist, refreshToken,
  getAllUsers, getUserById, updateUserRole, toggleUserStatus, getAuditLogs,
  getCaptcha, verifySession, getRoles, createRole, updateRole, deleteRole,
  getActiveSessions, revokeSession
} from '../controllers/authController.js';
import { getStoreConfig, updateStoreConfig, verifyAuditLogIntegrity } from '../controllers/settingsController.js';
import { 
  validateRequest, loginRules, registerRules, verifyOtpRules, 
  forgotPasswordRules, resetPasswordRules, updateProfileRules, 
  addressRules, updateAddressRules, wishlistRules 
} from '../middleware/validation.js';
import { requireAdmin, requirePermission } from '../middleware/adminMiddleware.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

import notificationRoutes from './notificationRoutes.js';

const router = express.Router();

const loginLimiter = createRateLimiter({
  max: 5,
  windowMs: 15 * 60 * 1000,
  message: 'Too many failed login attempts. Account temporarily locked for 15 minutes.'
});

const forgotPasswordLimiter = createRateLimiter({
  max: 3,
  windowMs: 15 * 60 * 1000,
  message: 'Too many OTP requests. Please try again in 15 minutes.'
});

// CAPTCHA & Gateway Session Verification
router.get('/captcha', getCaptcha);
router.post('/verify-session', verifySession);

// Authentication Routes
router.post('/login', loginLimiter, loginRules, validateRequest, login);
router.post('/register', registerRules, validateRequest, register);
router.post('/verify-otp', verifyOtpRules, validateRequest, verifyOtp);
router.post('/forgot-password', forgotPasswordLimiter, forgotPasswordRules, validateRequest, forgotPassword);
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

// Notifications
router.use('/notifications', notificationRoutes);

// Admin User Management & Audit Routes
router.get('/admin/users', requireAdmin, requirePermission('users.view'), getAllUsers);
router.get('/admin/users/:id', requireAdmin, requirePermission('users.view'), getUserById);
router.patch('/admin/users/:id/role', requireAdmin, requirePermission('users.manage'), updateUserRole);
router.patch('/admin/users/:id/status', requireAdmin, requirePermission('users.block'), toggleUserStatus);
router.get('/admin/audit-logs', requireAdmin, requirePermission('audit.view'), getAuditLogs);
router.get('/admin/audit-logs/verify-integrity', requireAdmin, requirePermission('audit.view'), verifyAuditLogIntegrity);

// Store Configuration & Feature Kill-switches
router.get('/admin/settings', getStoreConfig);
router.put('/admin/settings', requireAdmin, requirePermission('settings.edit'), updateStoreConfig);

// Dynamic RBAC Role Management Routes
router.get('/admin/roles', requireAdmin, requirePermission('roles.manage'), getRoles);
router.post('/admin/roles', requireAdmin, requirePermission('roles.manage'), createRole);
router.put('/admin/roles/:id', requireAdmin, requirePermission('roles.manage'), updateRole);
router.delete('/admin/roles/:id', requireAdmin, requirePermission('roles.manage'), deleteRole);

// Active Session Management & Revocation Routes
router.get('/admin/sessions', requireAdmin, requirePermission('sessions.manage'), getActiveSessions);
router.post('/admin/sessions/revoke', requireAdmin, requirePermission('sessions.manage'), revokeSession);

export default router;
