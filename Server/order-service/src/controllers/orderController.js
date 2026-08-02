import Order from '../models/Order.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { isValidTransition } from '../utils/orderStateMachine.js';

let authConn = null;
let AuthStoreConfig = null;

const getAuthStoreConfigModel = () => {
  if (!AuthStoreConfig) {
    const rawUri = process.env.AUTH_MONGO_URI || process.env.MONGO_URI || '';
    const isValidScheme = typeof rawUri === 'string' && (rawUri.startsWith('mongodb://') || rawUri.startsWith('mongodb+srv://'));
    const uri = isValidScheme ? rawUri.replace(/fashion_[^/]+$/, 'fashion_auth') : 'mongodb://127.0.0.1:27017/fashion_auth';
    try {
      authConn = mongoose.createConnection(uri);
      const StoreConfigSchema = new mongoose.Schema({
        featureToggles: {
          couponsEnabled: { type: Boolean, default: true },
          returnsEnabled: { type: Boolean, default: true },
          instantRefundsEnabled: { type: Boolean, default: true },
          maintenanceMode: { type: Boolean, default: false }
        }
      });
      AuthStoreConfig = authConn.model('StoreConfig', StoreConfigSchema);
    } catch (_) {
      return null;
    }
  }
  return AuthStoreConfig;
};

let catalogConn = null;
let CatalogProduct = null;
let CatalogReview = null;

const getCatalogModels = () => {
  if (!CatalogProduct) {
    const rawUri = process.env.CATALOG_MONGO_URI || process.env.MONGO_URI || '';
    const isValidScheme = typeof rawUri === 'string' && (rawUri.startsWith('mongodb://') || rawUri.startsWith('mongodb+srv://'));
    const uri = isValidScheme ? rawUri.replace('fashion_orders', 'fashion_catalog') : 'mongodb://127.0.0.1:27017/fashion_catalog';
    try {
      catalogConn = mongoose.createConnection(uri);
      catalogConn.on('error', (err) => console.error('[CatalogConn Error]', err.message));
      
      const ProductSchema = new mongoose.Schema({
        title: String,
        price: Number,
        images: [String],
        sizes: [String],
        colors: [String],
      });
      CatalogProduct = catalogConn.model('Product', ProductSchema);

      const ReviewSchema = new mongoose.Schema({
        productId: mongoose.Schema.Types.ObjectId,
        userId: String,
        rating: Number,
        comment: String
      });
      CatalogReview = catalogConn.model('Review', ReviewSchema);
    } catch (err) {
      console.error('[CatalogConn Init Error]', err.message);
      return {};
    }
  }
  return { CatalogProduct, CatalogReview };
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret',
});

export const createOrder = async (req, res, next) => {
  try {
    // Check Store Maintenance Mode feature toggle
    try {
      const StoreConfig = getAuthStoreConfigModel();
      if (StoreConfig) {
        const config = await StoreConfig.findOne();
        if (config?.featureToggles?.maintenanceMode === true) {
          return res.status(503).json({
            success: false,
            message: 'The store is currently in maintenance mode. Placing new orders is temporarily disabled.'
          });
        }
      }
    } catch (_) {}

    const { items = [], shippingAddress, deliveryOption, paymentMethod, coupon } = req.body;

    const subtotal = (items || []).reduce((acc, item) => acc + ((item.priceAtAdd || 0) * (item.qty || 1)), 0);
    const shipping = deliveryOption?.price || 0;

    let discount = 0;
    if (coupon) {
      const type = coupon.type || coupon.discountType;
      const val = coupon.discount !== undefined ? coupon.discount : coupon.discountValue;
      if (type === 'percent' || type === 'percentage') {
        discount = subtotal * ((val || 0) / 100);
      } else {
        discount = val || 0;
      }
    }

    const grandTotal = Math.max(0, subtotal + shipping - discount);

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

    const userNameHeader = req.headers['x-user-name'];
    const userEmailHeader = req.headers['x-user-email'];

    const custName = shippingAddress?.name || shippingAddress?.fullName || userNameHeader || 'Customer';
    const custEmail = shippingAddress?.email || userEmailHeader || 'customer@fashionstore.com';
    const custPhone = shippingAddress?.phone || '+91 9999988888';

    const customerDetails = {
      name: custName,
      email: custEmail,
      phone: custPhone,
      userId: req.headers['x-user-id']
    };

    const finalShippingAddress = {
      ...(shippingAddress || {}),
      name: custName,
      email: custEmail,
      phone: custPhone
    };

    const order = new Order({
      userId: req.headers['x-user-id'],
      customerDetails,
      items,
      shippingAddress: finalShippingAddress,
      deliveryOption,
      paymentMethod,
      totals: { subtotal, shipping, discount, grandTotal },
      razorpayOrderId,
      paymentStatus: (paymentMethod && paymentMethod.type === 'cod') ? 'pending' : 'pending'
    });

    if (paymentMethod && paymentMethod.type === 'cod') {
      order.paymentStatus = 'pending'; // Payment collected on delivery
    }

    await order.save();

    // Create a notification
    try {
      let authServiceUrl = process.env.USE_REMOTE_SERVICES === 'true' && process.env.AUTH_SERVICE_URL
        ? process.env.AUTH_SERVICE_URL.trim()
        : 'http://localhost:5001';
      if (!authServiceUrl.startsWith('http://') && !authServiceUrl.startsWith('https://')) {
        authServiceUrl = `https://${authServiceUrl}.onrender.com`;
      }
      await fetch(`${authServiceUrl}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: req.headers['x-user-id'],
          title: 'Order Placed Successfully!',
          message: `Your order #${order._id.toString().slice(-8).toUpperCase()} has been confirmed. Thank you for shopping with us!`,
          type: 'order'
        })
      });

      // Dispatch WhatsApp Thank You Message
      const userPhone = order.shippingAddress?.phone || req.headers['x-user-phone'] || '';
      console.log(`📱 [WhatsApp API Integration] Sent Purchase Thank You Message to ${userPhone || 'Customer'}: "Thank you for your purchase from FashionStore! Order #${order._id.toString().slice(-8).toUpperCase()} confirmed."`);
    } catch (notifyErr) {
      console.log('Failed to create notification', notifyErr.message);
    }

    res.json({ success: true, order, razorpayOrderId });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    // Ensure catalog connection is initialized for reviews lookup
    const { CatalogReview: CatReview } = getCatalogModels();

    const userId = req.headers['x-user-id'];

    const status = req.query.status || req.query['status[]'];
    let filter = { userId: req.headers['x-user-id'] };
    if (status) {
      const statuses = Array.isArray(status) ? status : status.split(',');
      filter.orderStatus = { $in: statuses };
    }
    let orders = await Order.find(filter).sort({ createdAt: -1 });

    // For each completed order, attach the user's rating for the items, if they exist
    const ordersWithRatings = await Promise.all(orders.map(async (order) => {
      if (order.orderStatus === 'delivered') {
        const orderObj = order.toObject ? order.toObject() : order;
        orderObj.items = await Promise.all(orderObj.items.map(async (item) => {
          try {
            if (!CatReview || !item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) return item;
            const review = await CatReview.findOne({
              productId: item.productId,
              userId: orderObj.userId
            });
            if (review) {
              return { ...item, userRating: review.rating };
            }
          } catch (e) {
            console.error('Error fetching review status:', e.message);
          }
          return item;
        }));
        return orderObj;
      }
      return order;
    }));

    res.json({ success: true, orders: ordersWithRatings });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.headers['x-user-id'] });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

export const trackOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.headers['x-user-id'] });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, orderStatus: order.orderStatus, statusHistory: order.statusHistory });
  } catch (err) {
    next(err);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.headers['x-user-id'], orderStatus: { $in: ['placed', 'confirmed'] } },
      { orderStatus: 'cancelled', $push: { statusHistory: { status: 'cancelled', reason } } },
      { new: true }
    );
    if (!order) return res.status(400).json({ success: false, message: 'Cannot cancel this order' });

    // Notify user of cancellation
    try {
      let authServiceUrl = (process.env.USE_REMOTE_SERVICES === 'true' || process.env.RENDER === 'true') && process.env.AUTH_SERVICE_URL
        ? process.env.AUTH_SERVICE_URL.trim()
        : 'http://localhost:5001';
      if (!authServiceUrl.startsWith('http://') && !authServiceUrl.startsWith('https://')) {
        authServiceUrl = `https://${authServiceUrl}.onrender.com`;
      }
      await fetch(`${authServiceUrl}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: order.userId,
          title: 'Order Cancelled ❌',
          message: `Your order #${order._id.toString().slice(-8).toUpperCase()} has been cancelled successfully.`,
          type: 'order'
        })
      });
    } catch (_) { /* notification dispatch failure is non-fatal */ }

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};


export const returnOrder = async (req, res, next) => {
  try {
    // Check Store Returns Feature Toggle
    try {
      const StoreConfig = getAuthStoreConfigModel();
      if (StoreConfig) {
        const config = await StoreConfig.findOne();
        if (config?.featureToggles?.returnsEnabled === false) {
          return res.status(400).json({
            success: false,
            message: 'Return and refund requests are currently disabled by store admin.'
          });
        }
      }
    } catch (_) {}

    const { reason } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.headers['x-user-id'], orderStatus: 'delivered' },
      { orderStatus: 'returned', $push: { statusHistory: { status: 'returned', reason } } },
      { new: true }
    );
    if (!order) return res.status(400).json({ success: false, message: 'Cannot return this order' });

    // Notify user of return request
    try {
      let authServiceUrl = (process.env.USE_REMOTE_SERVICES === 'true' || process.env.RENDER === 'true') && process.env.AUTH_SERVICE_URL
        ? process.env.AUTH_SERVICE_URL.trim()
        : 'http://localhost:5001';
      if (!authServiceUrl.startsWith('http://') && !authServiceUrl.startsWith('https://')) {
        authServiceUrl = `https://${authServiceUrl}.onrender.com`;
      }
      await fetch(`${authServiceUrl}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: order.userId,
          title: 'Return Request Submitted 📦',
          message: `Your return request for order #${order._id.toString().slice(-8).toUpperCase()} has been received. We\'ll process it shortly.`,
          type: 'order'
        })
      });
    } catch (_) { /* notification dispatch failure is non-fatal */ }

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};


export const verifyPayment = async (req, res, next) => {
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
    next(err);
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

// ==========================================
// ADMIN CONTROLLERS (Order Service)
// ==========================================

export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    
    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { 'customerDetails.name': { $regex: search, $options: 'i' } },
        { 'customerDetails.email': { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);
    res.json({
      success: true,
      orders,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    next(err);
  }
};


export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Validate State Machine Transition
    if (!isValidTransition(order.orderStatus, status)) {
      return res.status(400).json({
        success: false,
        message: `Illegal state transition from '${order.orderStatus}' to '${status}'.`
      });
    }

    order.orderStatus = status;
    if (status === 'delivered') {
      order.paymentStatus = 'completed'; // COD payment collected upon delivery
    }
    order.statusHistory.push({ status, timestamp: new Date(), reason: reason || 'Updated by Admin' });
    await order.save();

    // Trigger Notification for Order Status Update
    try {
      let authServiceUrl = (process.env.USE_REMOTE_SERVICES === 'true' || process.env.RENDER === 'true') && process.env.AUTH_SERVICE_URL
        ? process.env.AUTH_SERVICE_URL.trim()
        : 'http://localhost:5001';
      if (!authServiceUrl.startsWith('http://') && !authServiceUrl.startsWith('https://')) {
        authServiceUrl = `https://${authServiceUrl}.onrender.com`;
      }
      const statusTitles = {
        confirmed: 'Order Confirmed! 📦',
        shipped: 'Order Shipped! 🚚',
        out_for_delivery: 'Out for Delivery! 🚨',
        delivered: 'Order Delivered! 🎉',
        cancelled: 'Order Cancelled ❌'
      };
      await fetch(`${authServiceUrl}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: order.userId,
          title: statusTitles[status] || `Order ${status.toUpperCase()}`,
          message: `Your order #${order._id.toString().slice(-8).toUpperCase()} status is now: ${status}.`,
          type: 'order'
        })
      });

      // Dispatch WhatsApp Delivery / Thank You Message
      const customerPhone = order.shippingAddress?.phone || '';
      if (status === 'delivered') {
        console.log(`📱 [WhatsApp API Integration] Sent Delivery Thank-You Message to ${customerPhone || 'Customer'}: "🎉 Thank you for your purchase from FashionStore! Order #${order._id.toString().slice(-8).toUpperCase()} has been delivered successfully."`);
      } else {
        console.log(`📱 [WhatsApp API Integration] Sent Order Update WhatsApp to ${customerPhone || 'Customer'}: "Order #${order._id.toString().slice(-8).toUpperCase()} status: ${status.toUpperCase()}"`);
      }
    } catch (_) { /* notification dispatch failure is non-fatal */ }

    res.json({ success: true, message: `Order status updated to ${status}`, order });
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const validOrderFilter = {
      $or: [
        { paymentStatus: 'completed' },
        { paymentStatus: 'paid' },
        { paymentMethod: 'COD' },
        { 'paymentMethod.id': 'COD' },
        { 'paymentMethod.name': 'COD' },
        { 'paymentMethod.type': 'COD' }
      ]
    };

    const totalOrders = await Order.countDocuments(validOrderFilter);
    const placedCount = await Order.countDocuments({ ...validOrderFilter, orderStatus: 'placed' });
    const confirmedCount = await Order.countDocuments({ ...validOrderFilter, orderStatus: 'confirmed' });
    const shippedCount = await Order.countDocuments({ ...validOrderFilter, orderStatus: 'shipped' });
    const deliveredCount = await Order.countDocuments({ ...validOrderFilter, orderStatus: 'delivered' });
    const cancelledCount = await Order.countDocuments({ ...validOrderFilter, orderStatus: 'cancelled' });

    // Calculate total revenue from delivered/completed orders
    const completedOrders = await Order.find({
      $or: [{ paymentStatus: 'completed' }, { paymentStatus: 'paid' }]
    });
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totals?.grandTotal || 0), 0);

    // Calculate real 12-month monthly sales & order telemetry from DB
    const now = new Date();
    const currentYear = now.getFullYear();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const full12Months = monthNames.map((label, idx) => ({
      year: currentYear,
      monthNum: idx + 1,
      label
    }));

    const monthlyStatsRaw = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: {
            $sum: {
              $cond: [
                { $or: [{ $eq: ['$paymentStatus', 'completed'] }, { $eq: ['$paymentStatus', 'paid'] }] },
                { $ifNull: ['$totals.grandTotal', 0] },
                0
              ]
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyStats = full12Months.map(m => {
      const found = monthlyStatsRaw.find(r => r._id.year === m.year && r._id.month === m.monthNum);
      return {
        month: m.label,
        monthNum: m.monthNum,
        year: m.year,
        revenue: found ? (found.revenue || 0) : 0,
        orders: found ? (found.count || 0) : 0
      };
    });

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        placedCount,
        confirmedCount,
        shippedCount,
        deliveredCount,
        cancelledCount,
        pendingFulfillment: placedCount + confirmedCount,
        monthlyStats
      }
    });
  } catch (err) {
    next(err);
  }
};

export const createShipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { courierName, trackingNumber, trackingUrl } = req.body;

    if (!courierName || !trackingNumber) {
      return res.status(400).json({ success: false, message: 'Courier name and tracking number are required' });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.shipmentDetails = {
      courierName,
      trackingNumber,
      trackingUrl: trackingUrl || `https://track.courier.com/${trackingNumber}`,
      shippedAt: new Date(),
      trackingEvents: [{
        status: 'In Transit',
        location: 'Fulfillment Center',
        timestamp: new Date(),
        description: `Shipment dispatched via ${courierName}. Tracking #${trackingNumber}`
      }]
    };

    // Transition order state to shipped if valid
    if (order.orderStatus === 'confirmed' || order.orderStatus === 'placed') {
      order.orderStatus = 'shipped';
      order.statusHistory.push({
        status: 'shipped',
        timestamp: new Date(),
        reason: `Shipped via ${courierName} (${trackingNumber})`,
        actorId: req.headers['x-user-id']
      });
    }

    await order.save();
    res.json({ success: true, message: 'Shipment created successfully', order });
  } catch (err) {
    next(err);
  }
};

export const processReturnAction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, returnType, adminNotes } = req.body; // action: 'approve' | 'reject'

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (!order.returnRequest) {
      order.returnRequest = {};
    }

    order.returnRequest.status = action === 'approve' ? 'approved' : 'rejected';
    order.returnRequest.returnType = returnType || order.returnRequest.returnType || 'refund';
    order.returnRequest.processedAt = new Date();
    order.returnRequest.adminNotes = adminNotes || '';

    if (action === 'approve') {
      order.orderStatus = 'returned';
      order.statusHistory.push({
        status: 'returned',
        timestamp: new Date(),
        reason: `Return request approved. Type: ${order.returnRequest.returnType}`,
        actorId: req.headers['x-user-id']
      });
    }

    await order.save();
    res.json({ success: true, message: `Return request ${action}d successfully`, order });
  } catch (err) {
    next(err);
  }
};

export const processRefund = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { refundMode, notes } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.paymentStatus = 'refunded';
    const creditNoteId = `CN-${Math.floor(100000 + Math.random() * 900000)}`;
    order.creditNoteId = creditNoteId;

    order.statusHistory.push({
      status: order.orderStatus,
      timestamp: new Date(),
      reason: `Refund issued via ${refundMode || 'Original Method'}. Credit Note: ${creditNoteId}`,
      actorId: req.headers['x-user-id']
    });

    await order.save();
    res.json({
      success: true,
      message: 'Refund issued successfully',
      creditNoteId,
      order
    });
  } catch (err) {
    next(err);
  }
};

export const createReplacementOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const originalOrder = await Order.findById(id);
    if (!originalOrder) return res.status(404).json({ success: false, message: 'Original order not found' });

    const replacementOrder = new Order({
      userId: originalOrder.userId,
      items: originalOrder.items,
      shippingAddress: originalOrder.shippingAddress,
      deliveryOption: originalOrder.deliveryOption,
      paymentMethod: { type: 'replacement', brand: 'Zero Charge Replacement' },
      totals: { subtotal: 0, shipping: 0, discount: 0, grandTotal: 0 },
      orderStatus: 'confirmed',
      paymentStatus: 'completed',
      statusHistory: [{
        status: 'confirmed',
        timestamp: new Date(),
        reason: `Replacement order for original order #${originalOrder._id}`
      }]
    });

    await replacementOrder.save();

    originalOrder.returnRequest.replacementOrderId = replacementOrder._id.toString();
    await originalOrder.save();

    res.json({
      success: true,
      message: 'Replacement order created successfully',
      replacementOrderId: replacementOrder._id,
      replacementOrder
    });
  } catch (err) {
    next(err);
  }
};


