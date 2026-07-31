import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import catalogRoutes from './src/routes/catalogRoutes.js';

const MONGO_URI = process.env.CATALOG_MONGO_URI || process.env.MONGO_URI;
const PORT = process.env.PORT || 5002;

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'catalog-service',
    dbConnected: mongoose.connection.readyState === 1,
    timestamp: new Date()
  });
});

app.use('/', catalogRoutes);

app.use((err, req, res, next) => {
  console.error('[Catalog Service Error Handler]', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const defaultLocalUri = 'mongodb://127.0.0.1:27017/fashion_catalog';
const primaryUri = (MONGO_URI && (MONGO_URI.startsWith('mongodb://') || MONGO_URI.startsWith('mongodb+srv://')))
  ? MONGO_URI
  : defaultLocalUri;

const connectDbWithFallback = async () => {
  try {
    await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 4000 });
    console.log(`🛍️ [Catalog Service] Connected to MongoDB (${primaryUri.includes('mongodb+srv') ? 'Cloud Atlas' : 'Local'})`);
  } catch (err) {
    console.warn(`⚠️ [Catalog Service] Primary DB connection failed (${err.message})`);
    if (primaryUri !== defaultLocalUri) {
      console.log(`🔄 [Catalog Service] Connecting to local MongoDB fallback: ${defaultLocalUri}`);
      try {
        await mongoose.connect(defaultLocalUri, { serverSelectionTimeoutMS: 4000 });
        console.log('🛍️ [Catalog Service] Connected to local MongoDB fallback successfully');
      } catch (localErr) {
        console.error('❌ [Catalog Service] Local MongoDB fallback failed:', localErr.message);
      }
    }
  }
};

connectDbWithFallback().then(() => {
  app.listen(PORT, '0.0.0.0', () => console.log(`🛍️ Catalog Service running on port ${PORT}`));
}).catch(() => {
  app.listen(PORT, '0.0.0.0', () => console.log(`🛍️ Catalog Service running on port ${PORT} (Offline DB mode)`));
});
