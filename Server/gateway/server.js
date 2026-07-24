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
  delete req.headers['x-user-name'];
  delete req.headers['x-user-email'];
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
    if (decoded.name) req.headers['x-user-name'] = decoded.name;
    if (decoded.email) req.headers['x-user-email'] = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

const getServiceUrl = (envVar, liveUrl, localPort) => {
  if (envVar) {
    let url = envVar.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`;
    }
    return url;
  }
  return `http://localhost:${localPort}`;
};

const AUTH_TARGET = getServiceUrl(process.env.AUTH_SERVICE_URL, 'https://fashion-auth-service-m4vh.onrender.com', 5001);
const CATALOG_TARGET = getServiceUrl(process.env.CATALOG_SERVICE_URL, 'https://fashion-catalog-service-zdsg.onrender.com', 5002);
const CART_TARGET = getServiceUrl(process.env.CART_SERVICE_URL, 'https://fashion-cart-service-dmu7.onrender.com', 5003);
const ORDER_TARGET = getServiceUrl(process.env.ORDER_SERVICE_URL, 'https://fashion-order-service-a4xr.onrender.com', 5004);

console.log(`[GATEWAY TARGETS] Auth: ${AUTH_TARGET} | Catalog: ${CATALOG_TARGET} | Cart: ${CART_TARGET} | Order: ${ORDER_TARGET}`);

// Define Routes & Protections
const routes = [
  // Auth Service (Mixed Public/Protected)
  { 
    path: '/api/v1/auth', 
    target: AUTH_TARGET,
    protectedPaths: ['/me', '/profile', '/wishlist', '/addresses', '/notifications', '/admin']
  },
  // Catalog Service (Public GET, Protected POST/PUT/DELETE & /admin)
  { 
    path: '/api/v1/products', 
    target: CATALOG_TARGET,
    protectedPaths: ['/reviews', '/admin']
  },
  // Cart Service (Fully Protected)
  { 
    path: '/api/v1/cart', 
    target: CART_TARGET,
    protectedPaths: ['/']
  },
  // Order Service (Fully Protected)
  { 
    path: '/api/v1/orders', 
    target: ORDER_TARGET,
    protectedPaths: ['/']
  }
];

// Setup proxy routes with selective middleware
routes.forEach((route) => {
  const targetUrl = route.target;
  let targetHost = '';
  try {
    targetHost = new URL(targetUrl).host;
  } catch (e) {
    targetHost = '';
  }

  const proxy = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    secure: false,
    pathRewrite: (path, req) => path.replace(route.path, ''),
    onProxyReq: (proxyReq, req, res) => {
      if (targetHost) {
        proxyReq.setHeader('host', targetHost);
      }
    },
    onError: (err, req, res) => {
      console.error(`[PROXY ERROR] Proxying ${req.method} ${req.url} to ${targetUrl} failed:`, err.message);
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

app.get('/debug-env', (req, res) => {
  res.json({
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
    CATALOG_SERVICE_URL: process.env.CATALOG_SERVICE_URL,
    CART_SERVICE_URL: process.env.CART_SERVICE_URL,
    ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL,
    PORT: process.env.PORT,
    RENDER: process.env.RENDER
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'Gateway is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
