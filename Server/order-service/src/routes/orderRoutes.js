import express from 'express';
import { 
  createOrder, getOrders, getOrderById, trackOrder, cancelOrder, returnOrder, 
  paymentWebhook, verifyPayment, getAllOrdersAdmin, updateOrderStatus, getDashboardStats 
} from '../controllers/orderController.js';
import {
  validateRequest,
  createOrderRules,
  orderIdParamRules,
  cancelOrderRules,
  returnOrderRules,
  verifyPaymentRules
} from '../middleware/validation.js';
import { requireAdmin, requirePermission } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', createOrderRules, validateRequest, createOrder);
router.get('/', getOrders);

// Admin Routes (Placed before /:id parameter routes)
router.get('/admin/orders', requireAdmin, requirePermission('orders.view'), getAllOrdersAdmin);
router.patch('/admin/orders/:id/status', requireAdmin, requirePermission('orders.status.update'), updateOrderStatus);
router.get('/admin/dashboard/stats', requireAdmin, requirePermission('dashboard.view'), getDashboardStats);

router.get('/:id', orderIdParamRules, validateRequest, getOrderById);
router.get('/:id/track', orderIdParamRules, validateRequest, trackOrder);
router.post('/:id/cancel', cancelOrderRules, validateRequest, cancelOrder);
router.post('/:id/return', returnOrderRules, validateRequest, returnOrder);
router.post('/verify-payment', verifyPaymentRules, validateRequest, verifyPayment);
router.post('/payment-webhook', paymentWebhook);

export default router;

