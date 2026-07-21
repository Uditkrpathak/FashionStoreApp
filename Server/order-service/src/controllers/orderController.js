import Order from '../models/Order.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { isValidTransition } from '../utils/orderStateMachine.js';

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
    const finalShippingAddress = {
      ...(shippingAddress || {}),
      name: shippingAddress?.name || shippingAddress?.fullName || userNameHeader || 'Customer'
    };

    const order = new Order({
      userId: req.headers['x-user-id'],
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
    next(err);
  }
};

const seededUsers = new Set();

const seedMockOrders = async (userId) => {
  try {
    // Ensure catalog connection is initialized
    const { CatalogProduct: CatProd } = getCatalogModels();
    if (!CatProd) {
      console.log('Catalog connection not available, cannot seed orders.');
      return;
    }

    // Only seed if user has no orders — don't wipe other users' orders
    const existingCount = await Order.countDocuments({ userId });
    if (existingCount > 0) {
      console.log(`User ${userId} already has ${existingCount} orders, skipping seed.`);
      return;
    }
    
    // 2. Fetch products from CatalogProduct
    const products = await CatProd.find({}).limit(6);
    if (!products || products.length === 0) {
      console.log('No products found in catalog to seed orders.');
      return;
    }
    
    const getProductItem = (index) => {
      const prod = products[index % products.length];
      return {
        productId: prod._id.toString(),
        title: prod.title,
        color: prod.colors?.[0] || 'Default',
        size: prod.sizes?.[0] || 'M',
        qty: 1,
        priceAtAdd: prod.price,
        image: prod.images?.[0] || 'https://via.placeholder.com/100'
      };
    };

    // 3. Create active orders
    const activeOrder1 = new Order({
      userId,
      orderStatus: 'placed',
      items: [getProductItem(0)],
      shippingAddress: { name: 'Rahul Sharma', line1: '42 MG Road, Block C', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+91 9876543210' },
      totals: { subtotal: products[0].price, shipping: 100, discount: 0, grandTotal: products[0].price + 100 },
      paymentStatus: 'pending',
      statusHistory: [{ status: 'placed', timestamp: new Date(Date.now() - 3600000) }]
    });

    const activeOrder2 = new Order({
      userId,
      orderStatus: 'shipped',
      items: [getProductItem(1 % products.length)],
      shippingAddress: { name: 'Priya Patel', line1: '15 CG Highway, Sector 4', city: 'Ahmedabad', state: 'Gujarat', pincode: '380009', phone: '+91 9812345678' },
      totals: { subtotal: products[1 % products.length].price, shipping: 0, discount: 0, grandTotal: products[1 % products.length].price },
      paymentStatus: 'completed',
      statusHistory: [
        { status: 'placed', timestamp: new Date(Date.now() - 3 * 3600000) },
        { status: 'confirmed', timestamp: new Date(Date.now() - 2 * 3600000) },
        { status: 'shipped', timestamp: new Date(Date.now() - 1 * 3600000) }
      ]
    });

    // 4. Create completed orders
    const completedOrder1 = new Order({
      userId,
      orderStatus: 'delivered',
      items: [getProductItem(2 % products.length)],
      shippingAddress: { name: 'Ananya Verma', line1: '78 Park Street, Apt 3B', city: 'Kolkata', state: 'West Bengal', pincode: '700016', phone: '+91 9765432109' },
      totals: { subtotal: products[2 % products.length].price, shipping: 0, discount: 0, grandTotal: products[2 % products.length].price },
      paymentStatus: 'completed',
      statusHistory: [
        { status: 'placed', timestamp: new Date(Date.now() - 4 * 24 * 3600000) },
        { status: 'confirmed', timestamp: new Date(Date.now() - 3 * 24 * 3600000) },
        { status: 'shipped', timestamp: new Date(Date.now() - 2 * 24 * 3600000) },
        { status: 'delivered', timestamp: new Date(Date.now() - 1 * 24 * 3600000) }
      ]
    });

    const completedOrder2 = new Order({
      userId,
      orderStatus: 'delivered',
      items: [getProductItem(3 % products.length)],
      shippingAddress: { name: 'Vikram Singh', line1: '102 Indiranagar 10th Main', city: 'Bengaluru', state: 'Karnataka', pincode: '560038', phone: '+91 9654321098' },
      totals: { subtotal: products[3 % products.length].price, shipping: 150, discount: 50, grandTotal: products[3 % products.length].price + 100 },
      paymentStatus: 'completed',
      statusHistory: [
        { status: 'placed', timestamp: new Date(Date.now() - 6 * 24 * 3600000) },
        { status: 'confirmed', timestamp: new Date(Date.now() - 5 * 24 * 3600000) },
        { status: 'shipped', timestamp: new Date(Date.now() - 4 * 24 * 3600000) },
        { status: 'delivered', timestamp: new Date(Date.now() - 3 * 24 * 3600000) }
      ]
    });

    // 5. Create cancelled orders
    const cancelledOrder1 = new Order({
      userId,
      orderStatus: 'cancelled',
      items: [getProductItem(4 % products.length)],
      shippingAddress: { name: 'Sneha Kapoor', line1: '88 Connaught Place', city: 'New Delhi', state: 'Delhi', pincode: '110001', phone: '+91 9543210987' },
      totals: { subtotal: products[4 % products.length].price, shipping: 0, discount: 0, grandTotal: products[4 % products.length].price },
      paymentStatus: 'pending',
      statusHistory: [
        { status: 'placed', timestamp: new Date(Date.now() - 2 * 3600000) },
        { status: 'cancelled', timestamp: new Date(Date.now() - 1 * 3600000), reason: 'User requested cancellation' }
      ]
    });

    const cancelledOrder2 = new Order({
      userId,
      orderStatus: 'cancelled',
      items: [getProductItem(5 % products.length)],
      shippingAddress: { name: 'Amit Roy', line1: '55 Jubilee Hills, Road No 36', city: 'Hyderabad', state: 'Telangana', pincode: '500033', phone: '+91 9432109876' },
      totals: { subtotal: products[5 % products.length].price, shipping: 100, discount: 0, grandTotal: products[5 % products.length].price + 100 },
      paymentStatus: 'pending',
      statusHistory: [
        { status: 'placed', timestamp: new Date(Date.now() - 5 * 3600000) },
        { status: 'cancelled', timestamp: new Date(Date.now() - 4 * 3600000), reason: 'Incorrect size selected' }
      ]
    });

    await Promise.all([
      activeOrder1.save(),
      activeOrder2.save(),
      completedOrder1.save(),
      completedOrder2.save(),
      cancelledOrder1.save(),
      cancelledOrder2.save()
    ]);
    
    console.log('Successfully cleared and seeded orders for user:', userId);
  } catch (err) {
    console.error('Error seeding mock orders:', err.message);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    // Ensure catalog connection is initialized for reviews lookup
    const { CatalogReview: CatReview } = getCatalogModels();

    const userId = req.headers['x-user-id'];
    if (userId && !seededUsers.has(userId)) {
      await seedMockOrders(userId);
      seededUsers.add(userId);
    }

    const status = req.query.status || req.query['status[]'];
    let filter = { userId: req.headers['x-user-id'] };
    if (status) {
      const statuses = Array.isArray(status) ? status : status.split(',');
      filter.orderStatus = { $in: statuses };
    }
    let orders = await Order.find(filter).sort({ createdAt: -1 });

    // Fallback: If no completed orders exist, check the Completed tab and inject a completed order dynamically
    const { CatalogProduct: CatProdFallback } = getCatalogModels();
    if (orders.length === 0 && status && status.includes('delivered') && CatProdFallback) {
      try {
        const product = await CatProdFallback.findOne({});
        if (product) {
          const mockOrder = {
            userId: req.headers['x-user-id'],
            orderStatus: 'delivered',
            items: [{
              productId: product._id.toString(),
              title: product.title,
              color: product.colors?.[0] || 'Default',
              size: product.sizes?.[0] || 'M',
              qty: 1,
              priceAtAdd: product.price,
              image: product.images?.[0] || 'https://via.placeholder.com/100'
            }],
            totals: {
              subtotal: product.price,
              shipping: 0,
              discount: 0,
              grandTotal: product.price
            },
            paymentStatus: 'completed',
            statusHistory: [
              { status: 'placed', timestamp: new Date(Date.now() - 4 * 24 * 3600000) },
              { status: 'confirmed', timestamp: new Date(Date.now() - 3 * 24 * 3600000) },
              { status: 'shipped', timestamp: new Date(Date.now() - 2 * 24 * 3600000) },
              { status: 'delivered', timestamp: new Date(Date.now() - 1 * 24 * 3600000) }
            ]
          };
          const newOrder = new Order(mockOrder);
          await newOrder.save();
          orders = [newOrder];
        }
      } catch (err) {
        console.error('Failed to auto-seed completed order:', err.message);
      }
    }

    // For each completed order, attach the user's rating for the items, if they exist
    const ordersWithRatings = await Promise.all(orders.map(async (order) => {
      if (order.orderStatus === 'delivered') {
        const orderObj = order.toObject ? order.toObject() : order;
        orderObj.items = await Promise.all(orderObj.items.map(async (item) => {
          try {
            if (!CatReview) return item;
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
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

export const returnOrder = async (req, res, next) => {
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

    if (status) query.orderStatus = status;

    // Auto-seed demo orders if the collection is completely empty
    const totalInDb = await Order.countDocuments();
    if (totalInDb === 0) {
      const adminUserId = req.headers['x-user-id'] || 'admin-demo-user';
      await seedMockOrders(adminUserId);
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
    order.statusHistory.push({ status, timestamp: new Date(), reason: reason || 'Updated by Admin' });
    await order.save();

    res.json({ success: true, message: `Order status updated to ${status}`, order });
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    // Auto-seed demo orders if collection is empty
    let totalOrders = await Order.countDocuments();
    if (totalOrders === 0) {
      const adminUserId = req.headers['x-user-id'] || 'admin-demo-user';
      await seedMockOrders(adminUserId);
      totalOrders = await Order.countDocuments();
    }
    const placedCount = await Order.countDocuments({ orderStatus: 'placed' });
    const confirmedCount = await Order.countDocuments({ orderStatus: 'confirmed' });
    const shippedCount = await Order.countDocuments({ orderStatus: 'shipped' });
    const deliveredCount = await Order.countDocuments({ orderStatus: 'delivered' });
    const cancelledCount = await Order.countDocuments({ orderStatus: 'cancelled' });

    // Calculate total revenue from delivered/completed orders
    const completedOrders = await Order.find({ paymentStatus: 'completed' });
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totals?.grandTotal || 0), 0);

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
        pendingFulfillment: placedCount + confirmedCount
      }
    });
  } catch (err) {
    next(err);
  }
};

