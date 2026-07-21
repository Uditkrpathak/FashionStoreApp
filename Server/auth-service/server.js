import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './src/routes/authRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import { seedDefaultAdmin } from './src/utils/seedAdmin.js';

// Environment variable validation
const MONGO_URI = process.env.AUTH_MONGO_URI || process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5001;

if (!MONGO_URI) {
  console.warn('WARNING: MONGO_URI environment variable is not set yet.');
}
if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is required.');
  process.exit(1);
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
    service: 'auth-service',
    timestamp: new Date()
  });
});

app.use('/', authRoutes);
app.use('/notifications', notificationRoutes);

// Centralized error handler middleware
app.use((err, req, res, next) => {
  console.error('[Error Handler]', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start HTTP server immediately so Render health checks pass cleanly
app.listen(PORT, () => console.log(`🔒 Auth Service running on port ${PORT}`));

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(async () => {
      console.log('Auth DB Connected');
      await seedDefaultAdmin();
    })
    .catch(err => {
      console.error('Database Error: Failed to connect to MongoDB', err.message);
    });
}
