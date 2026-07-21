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

const formatTargetUrl = (url, fallback) => {
  let trimmed = (url || '').trim();
  // Prevent circular proxy loops if env var is missing or points to gateway itself
  if (!trimmed || trimmed.includes('fashion-gateway') || trimmed === 'localhost') {
    trimmed = fallback;
  }
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

// Define Routes & Protections
const routes = [
  // Auth Service (Mixed Public/Protected)
  { 
    path: '/api/v1/auth', 
    target: formatTargetUrl(process.env.AUTH_SERVICE_URL, 'https://fashion-auth-service.onrender.com'),
    protectedPaths: ['/me', '/profile', '/wishlist', '/addresses', '/notifications', '/admin']
  },
  // Catalog Service (Public GET, Protected POST/PUT/DELETE & /admin)
  { 
    path: '/api/v1/products', 
    target: formatTargetUrl(process.env.CATALOG_SERVICE_URL, 'https://fashion-catalog-service.onrender.com'),
    protectedPaths: ['/reviews', '/admin']
  },
  // Cart Service (Fully Protected)
  { 
    path: '/api/v1/cart', 
    target: formatTargetUrl(process.env.CART_SERVICE_URL, 'https://fashion-cart-service.onrender.com'),
    protectedPaths: ['/']
  },
  // Order Service (Fully Protected)
  { 
    path: '/api/v1/orders', 
    target: formatTargetUrl(process.env.ORDER_SERVICE_URL, 'https://fashion-order-service.onrender.com'),
    protectedPaths: ['/']
  }
];

// Setup proxy routes with selective middleware
routes.forEach((route) => {
  const proxy = createProxyMiddleware({
    target: route.target,
    changeOrigin: true,
    pathRewrite: (path, req) => path.replace(route.path, ''),
    onError: (err, req, res) => {
      console.error(`[PROXY ERROR] Proxying ${req.method} ${req.url} to ${route.target} failed:`, err.message);
      if (!res.headersSent) {
        res.status(502).json({ success: false, message: 'Bad Gateway: Microservice connection failed.' });
      }
    }
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
