import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import orderRoutes from './src/routes/orderRoutes.js';

const MONGO_URI = process.env.ORDER_MONGO_URI || process.env.MONGO_URI;
const PORT = process.env.PORT || 5004;

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'order-service',
    dbConnected: mongoose.connection.readyState === 1,
    timestamp: new Date()
  });
});

app.use('/', orderRoutes);

app.use((err, req, res, next) => {
  console.error('[Order Service Error Handler]', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => console.log(`📦 Order Service running on port ${PORT}`));

const defaultLocalUri = 'mongodb://127.0.0.1:27017/fashion_orders';
const primaryUri = (MONGO_URI && (MONGO_URI.startsWith('mongodb://') || MONGO_URI.startsWith('mongodb+srv://')))
  ? MONGO_URI
  : defaultLocalUri;

const connectDbWithFallback = async () => {
  try {
    await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 4000 });
    console.log(`📦 [Order Service] Connected to MongoDB (${primaryUri.includes('mongodb+srv') ? 'Cloud Atlas' : 'Local'})`);
  } catch (err) {
    console.warn(`⚠️ [Order Service] Primary DB connection failed (${err.message})`);
    if (primaryUri !== defaultLocalUri) {
      console.log(`🔄 [Order Service] Connecting to local MongoDB fallback: ${defaultLocalUri}`);
      try {
        await mongoose.connect(defaultLocalUri, { serverSelectionTimeoutMS: 4000 });
        console.log('📦 [Order Service] Connected to local MongoDB fallback successfully');
      } catch (localErr) {
        console.error('❌ [Order Service] Local MongoDB fallback failed:', localErr.message);
      }
    }
  }
};

connectDbWithFallback();
