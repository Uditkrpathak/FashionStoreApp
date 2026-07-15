import express from 'express';
import { createOrder, getOrders, getOrderById, trackOrder, cancelOrder, returnOrder, paymentWebhook, verifyPayment } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.get('/:id/track', trackOrder);
router.post('/:id/cancel', cancelOrder);
router.post('/:id/return', returnOrder);
router.post('/verify-payment', verifyPayment);
router.post('/payment-webhook', paymentWebhook);

export default router;
