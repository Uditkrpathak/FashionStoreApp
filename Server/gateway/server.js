import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Simple logging
app.use((req, res, next) => {
  console.log(`[GATEWAY] ${req.method} ${req.url}`);
  next();
});

// Auth Middleware for protected routes
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Pass user ID to downstream microservices via header
    req.headers['x-user-id'] = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

// Define Routes & Protections
const routes = [
  // Auth Service (Mixed Public/Protected)
  { 
    path: '/api/v1/auth', 
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
    protectedPaths: ['/me', '/profile', '/wishlist', '/addresses', '/notifications']
  },
  // Catalog Service (Public GET, Protected POST/PUT/DELETE ideally, but keeping simple for now)
  { 
    path: '/api/v1/products', 
    target: process.env.CATALOG_SERVICE_URL || 'http://localhost:5002',
    protectedPaths: ['/reviews'] // protect review submission
  },
  // Cart Service (Fully Protected)
  { 
    path: '/api/v1/cart', 
    target: process.env.CART_SERVICE_URL || 'http://localhost:5003',
    protectedPaths: ['/'] // everything protected
  },
  // Order Service (Fully Protected)
  { 
    path: '/api/v1/orders', 
    target: process.env.ORDER_SERVICE_URL || 'http://localhost:5004',
    protectedPaths: ['/'] // everything protected
  }
];

// Setup proxy routes with selective middleware
routes.forEach((route) => {
  const proxy = createProxyMiddleware({
    target: route.target,
    changeOrigin: true,
    pathRewrite: (path, req) => path.replace(route.path, ''),
  });

  app.use(route.path, (req, res, next) => {
    // Check if current request path starts with any protected path
    // For exact matching in auth like /api/v1/auth/me -> req.path will be /me here
    const isProtected = route.protectedPaths.some(p => req.path.startsWith(p));
    
    // Exception for webhooks
    const isWebhook = req.path.startsWith('/payment-webhook');
    
    if (isProtected && !isWebhook) {
      verifyToken(req, res, () => proxy(req, res, next));
    } else {
      proxy(req, res, next);
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'Gateway is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
