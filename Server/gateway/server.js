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

// Identity Header Sanitization Middleware - Prevents identity spoofing
app.use((req, res, next) => {
  delete req.headers['x-user-id'];
  delete req.headers['x-user-role'];
  delete req.headers['x-user-permissions'];
  next();
});

// Auth Middleware for protected routes
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Inject verified user claims into headers for downstream microservices
    req.headers['x-user-id'] = decoded.id;
    req.headers['x-user-role'] = decoded.role || 'user';
    req.headers['x-user-permissions'] = JSON.stringify(decoded.permissions || []);
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
    protectedPaths: ['/me', '/profile', '/wishlist', '/addresses', '/notifications', '/admin']
  },
  // Catalog Service (Public GET, Protected POST/PUT/DELETE & /admin)
  { 
    path: '/api/v1/products', 
    target: process.env.CATALOG_SERVICE_URL || 'http://localhost:5002',
    protectedPaths: ['/reviews', '/admin']
  },
  // Cart Service (Fully Protected)
  { 
    path: '/api/v1/cart', 
    target: process.env.CART_SERVICE_URL || 'http://localhost:5003',
    protectedPaths: ['/']
  },
  // Order Service (Fully Protected)
  { 
    path: '/api/v1/orders', 
    target: process.env.ORDER_SERVICE_URL || 'http://localhost:5004',
    protectedPaths: ['/']
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
