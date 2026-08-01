import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Request logger
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

const getServiceUrl = (envVar, defaultLiveUrl, localPort) => {
  if (process.env.USE_REMOTE_SERVICES === 'true') {
    let url = (envVar || defaultLiveUrl).trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}.onrender.com`;
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

// Auth Middleware for protected routes with Session Revocation Verification
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Session validation check for instant token revocation
    if (decoded.jti) {
      try {
        const authVerifyUrl = `${AUTH_TARGET}/verify-session`;
        const sessionRes = await fetch(authVerifyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jti: decoded.jti })
        });
        const sessionData = await sessionRes.json();
        if (sessionRes.ok && sessionData.success && sessionData.isValid === false) {
          return res.status(401).json({ success: false, message: 'Unauthorized: Your session has been revoked or expired' });
        }
      } catch (sessionErr) {
        console.warn('[GATEWAY SESSION VERIFY WARN]', sessionErr.message);
      }
    }

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

// Define Routes & Protections
const routes = [
  { 
    path: '/api/v1/auth', 
    target: AUTH_TARGET,
    protectedPaths: ['/me', '/profile', '/wishlist', '/addresses', '/notifications', '/admin']
  },
  { 
    path: '/api/v1/products', 
    target: CATALOG_TARGET,
    protectedPaths: ['/reviews', '/admin']
  },
  { 
    path: '/api/v1/cart', 
    target: CART_TARGET,
    protectedPaths: ['/']
  },
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
      console.error(`🚨 [GATEWAY PROXY ERROR DEBUG] ${req.method} ${req.originalUrl || req.url} -> ${targetUrl} failed:`, err.message);
      if (!res.headersSent) {
        res.status(502).json({
          success: false,
          message: `Bad Gateway: Microservice connection failed. Target: ${targetUrl} (${err.message})`
        });
      }
    }
  });

  app.use(route.path, (req, res, next) => {
    const isProtected = route.protectedPaths.some(p => req.path.startsWith(p));
    const isWebhook = req.path.startsWith('/payment-webhook');
    
    if (isProtected && !isWebhook) {
      verifyToken(req, res, () => proxy(req, res, next));
    } else {
      proxy(req, res, next);
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'gateway-service',
    timestamp: new Date()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Gateway Service running on port ${PORT}`);
});
