import Order from '../models/Order.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret',
});

export const createOrder = async (req, res) => {
  try {
    const { items = [], shippingAddress, deliveryOption, paymentMethod } = req.body;

    const subtotal = (items || []).reduce((acc, item) => acc + ((item.priceAtAdd || 0) * (item.qty || 1)), 0);
    const shipping = deliveryOption?.price || 0;
    const grandTotal = subtotal + shipping;

    let razorpayOrderId = null;

    // Only create a Razorpay order if payment method is not COD
    if (paymentMethod && paymentMethod.type !== 'cod') {
      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(grandTotal * 100), // amount in smallest currency unit (paise)
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`
      });
      razorpayOrderId = rzpOrder.id;
    }

    const order = new Order({
      userId: req.headers['x-user-id'],
      items, shippingAddress, deliveryOption, paymentMethod,
      totals: { subtotal, shipping, discount: 0, grandTotal },
      razorpayOrderId,
      paymentStatus: (paymentMethod && paymentMethod.type === 'cod') ? 'completed' : 'pending' // Just for demo, COD implies pending collection, but we mark it differently or leave it pending. We'll leave it pending actually.
    });

    if (paymentMethod && paymentMethod.type === 'cod') {
      order.paymentStatus = 'pending'; // Payment collected on delivery
    }

    await order.save();

    // Create a notification
    try {
      const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';
      await fetch(`${authServiceUrl}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: req.headers['x-user-id'],
          title: 'Order Placed Successfully!',
          message: `Your order #${order._id.toString().slice(-8).toUpperCase()} has been confirmed.`,
          type: 'order'
        })
      });
    } catch (notifyErr) {
      console.log('Failed to create notification', notifyErr.message);
    }

    res.json({ success: true, order, razorpayOrderId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const status = req.query.status || req.query['status[]'];
    let filter = { userId: req.headers['x-user-id'] };
    if (status) {
      const statuses = Array.isArray(status) ? status : status.split(',');
      filter.orderStatus = { $in: statuses };
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.headers['x-user-id'] });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.headers['x-user-id'] });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, orderStatus: order.orderStatus, statusHistory: order.statusHistory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.headers['x-user-id'], orderStatus: { $in: ['placed', 'confirmed'] } },
      { orderStatus: 'cancelled', $push: { statusHistory: { status: 'cancelled', reason } } },
      { new: true }
    );
    if (!order) return res.status(400).json({ success: false, message: 'Cannot cancel this order' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const returnOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.headers['x-user-id'], orderStatus: 'delivered' },
      { orderStatus: 'returned', $push: { statusHistory: { status: 'returned', reason } } },
      { new: true }
    );
    if (!order) return res.status(400).json({ success: false, message: 'Cannot return this order' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret';
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { paymentStatus: 'completed' },
        { new: true }
      );
      return res.json({ success: true, message: 'Payment verified successfully', order });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const paymentWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_test_mock_secret';

    // Verifying Razorpay signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
      // Signature is valid, process webhook
      const event = req.body.event;
      if (event === 'payment.captured') {
        const paymentInfo = req.body.payload.payment.entity;
        const razorpayOrderId = paymentInfo.order_id;

        // Find order and update status
        const order = await Order.findOneAndUpdate(
          { razorpayOrderId },
          {
            paymentStatus: 'completed',
            razorpayPaymentId: paymentInfo.id,
            orderStatus: 'confirmed',
            $push: { statusHistory: { status: 'confirmed', reason: 'Payment captured' } }
          },
          { new: true }
        );

        if (order) {
          console.log(`Order ${order._id} confirmed via payment capture.`);
        }
      }
      res.status(200).json({ status: 'ok' });
    } else {
      res.status(400).json({ status: 'invalid signature' });
    }
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ status: 'error' });
  }
};
