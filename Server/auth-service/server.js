import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './src/routes/authRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import { seedDefaultAdmin } from './src/utils/seedAdmin.js';

const MONGO_URI = process.env.AUTH_MONGO_URI || process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const PORT = process.env.PORT || 5001;

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'auth-service',
    dbConnected: mongoose.connection.readyState === 1,
    timestamp: new Date()
  });
});

app.use('/', authRoutes);
app.use('/notifications', notificationRoutes);

// Centralized error handler middleware
app.use((err, req, res, next) => {
  console.error('[Auth Service Error Handler]', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => console.log(`🔒 Auth Service running on port ${PORT}`));

// Robust MongoDB Connection with Fallback and Seeding
const defaultLocalUri = 'mongodb://127.0.0.1:27017/fashion_auth';
const primaryUri = (MONGO_URI && (MONGO_URI.startsWith('mongodb://') || MONGO_URI.startsWith('mongodb+srv://')))
  ? MONGO_URI
  : defaultLocalUri;

const connectDbWithFallback = async () => {
  try {
    await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 4000 });
    console.log(`🔒 [Auth Service] Connected to MongoDB (${primaryUri.includes('mongodb+srv') ? 'Cloud Atlas' : 'Local'})`);
    await seedDefaultAdmin();
  } catch (err) {
    console.warn(`⚠️ [Auth Service] Primary DB connection failed (${err.message})`);
    if (primaryUri !== defaultLocalUri) {
      console.log(`🔄 [Auth Service] Connecting to local MongoDB fallback: ${defaultLocalUri}`);
      try {
        await mongoose.connect(defaultLocalUri, { serverSelectionTimeoutMS: 4000 });
        console.log('🔒 [Auth Service] Connected to local MongoDB fallback successfully');
        await seedDefaultAdmin();
      } catch (localErr) {
        console.error('❌ [Auth Service] Local MongoDB fallback failed:', localErr.message);
      }
    }
  }
};

connectDbWithFallback();
