// In-memory Rate Limiting Middleware for Auth Service
const attempts = new Map();

// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of attempts.entries()) {
    if (now > record.resetTime) {
      attempts.delete(key);
    }
  }
}, 10 * 60 * 1000);

export const createRateLimiter = ({ max = 5, windowMs = 15 * 60 * 1000, message = 'Too many failed login attempts. Please try again in 15 minutes.' }) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const email = req.body.email ? req.body.email.toLowerCase() : '';
    const key = `${ip}:${email}:${req.path}`;
    const now = Date.now();

    const record = attempts.get(key);
    if (record) {
      if (now < record.resetTime) {
        if (record.count >= max) {
          return res.status(429).json({
            success: false,
            message,
            retryAfter: Math.ceil((record.resetTime - now) / 1000)
          });
        }
      } else {
        // Reset window
        attempts.set(key, { count: 1, resetTime: now + windowMs });
        return next();
      }
    }

    next();
  };
};

export const registerFailedAttempt = (req) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const email = req.body.email ? req.body.email.toLowerCase() : '';
  const key = `${ip}:${email}:${req.path}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;

  const record = attempts.get(key);
  if (record && now < record.resetTime) {
    record.count += 1;
  } else {
    attempts.set(key, { count: 1, resetTime: now + windowMs });
  }
};

export const resetFailedAttempts = (req) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const email = req.body.email ? req.body.email.toLowerCase() : '';
  const key = `${ip}:${email}:${req.path}`;
  attempts.delete(key);
};
