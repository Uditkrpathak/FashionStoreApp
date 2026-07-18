import express from 'express';
import { createOrder, getOrders, getOrderById, trackOrder, cancelOrder, returnOrder, paymentWebhook, verifyPayment } from '../controllers/orderController.js';
import {
  validateRequest,
  createOrderRules,
  orderIdParamRules,
  cancelOrderRules,
  returnOrderRules,
  verifyPaymentRules
} from '../middleware/validation.js';

const router = express.Router();

router.post('/', createOrderRules, validateRequest, createOrder);
router.get('/', getOrders);
router.get('/:id', orderIdParamRules, validateRequest, getOrderById);
router.get('/:id/track', orderIdParamRules, validateRequest, trackOrder);
router.post('/:id/cancel', cancelOrderRules, validateRequest, cancelOrder);
router.post('/:id/return', returnOrderRules, validateRequest, returnOrder);
router.post('/verify-payment', verifyPaymentRules, validateRequest, verifyPayment);
router.post('/payment-webhook', paymentWebhook);

export default router;
