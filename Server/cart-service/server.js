import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cartRoutes from './src/routes/cartRoutes.js';

const MONGO_URI = process.env.CART_MONGO_URI || process.env.MONGO_URI;
const PORT = process.env.PORT || 5003;

if (!MONGO_URI) {
  console.warn('WARNING: MONGO_URI environment variable is not set yet.');
}

const app = express();

// Secure headers
app.use(helmet());

// Request logging
app.use(morgan('dev'));

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'cart-service',
    timestamp: new Date()
  });
});

app.use('/', cartRoutes);

// Centralized error handler middleware
app.use((err, req, res, next) => {
  console.error('[Cart Service Error Handler]', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start HTTP server immediately so Render health checks pass cleanly
app.listen(PORT, () => console.log(`🛒 Cart Service running on port ${PORT}`));

const rawUri = process.env.CART_MONGO_URI || process.env.MONGO_URI;
const isValidScheme = typeof rawUri === 'string' && (rawUri.startsWith('mongodb://') || rawUri.startsWith('mongodb+srv://'));

if (isValidScheme) {
  mongoose.connect(rawUri)
    .then(() => console.log('Cart DB Connected'))
    .catch(err => console.error('Database Error: Failed to connect to MongoDB', err.message));
} else {
  console.warn('WARNING: Valid MONGO_URI (starting with mongodb:// or mongodb+srv://) is not provided yet.');
}
