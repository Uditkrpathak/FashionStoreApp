import express from 'express';
import { 
  createOrder, getOrders, getOrderById, trackOrder, cancelOrder, returnOrder, 
  paymentWebhook, verifyPayment, getAllOrdersAdmin, updateOrderStatus, getDashboardStats,
  createShipment, processReturnAction, processRefund, createReplacementOrder
} from '../controllers/orderController.js';
import {
  getAllTickets, getTicketById, createTicket, replyTicket, escalateTicket, closeTicket, getUserTickets
} from '../controllers/ticketController.js';
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

// User Support Ticket Routes
router.get('/tickets/my', getUserTickets);
router.get('/tickets/:id', getTicketById);
router.post('/tickets', createTicket);
router.post('/tickets/:id/reply', replyTicket);

// Admin Order & Fulfillment Routes
router.get('/admin/orders', requireAdmin, requirePermission('orders.view'), getAllOrdersAdmin);
router.patch('/admin/orders/:id/status', requireAdmin, requirePermission('orders.status.update'), updateOrderStatus);
router.post('/admin/orders/:id/shipment', requireAdmin, requirePermission('orders.status.update'), createShipment);
router.post('/admin/orders/:id/return-action', requireAdmin, requirePermission('orders.status.update'), processReturnAction);
router.post('/admin/orders/:id/refund', requireAdmin, requirePermission('orders.status.update'), processRefund);
router.post('/admin/orders/:id/replacement', requireAdmin, requirePermission('orders.status.update'), createReplacementOrder);
router.get('/admin/dashboard/stats', requireAdmin, requirePermission('dashboard.view'), getDashboardStats);

// Support Ticket Management Routes (Admin)
router.get('/admin/tickets', requireAdmin, requirePermission('orders.view'), getAllTickets);
router.get('/admin/tickets/:id', requireAdmin, requirePermission('orders.view'), getTicketById);
router.post('/admin/tickets/:id/reply', requireAdmin, requirePermission('orders.view'), replyTicket);
router.post('/admin/tickets/:id/escalate', requireAdmin, requirePermission('orders.view'), escalateTicket);
router.post('/admin/tickets/:id/close', requireAdmin, requirePermission('orders.view'), closeTicket);

router.get('/:id', orderIdParamRules, validateRequest, getOrderById);
router.get('/:id/track', orderIdParamRules, validateRequest, trackOrder);
router.post('/:id/cancel', cancelOrderRules, validateRequest, cancelOrder);
router.post('/:id/return', returnOrderRules, validateRequest, returnOrder);
router.post('/verify-payment', verifyPaymentRules, validateRequest, verifyPayment);
router.post('/payment-webhook', paymentWebhook);

export default router;
