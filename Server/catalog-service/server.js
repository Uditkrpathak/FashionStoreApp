import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import catalogRoutes from './src/routes/catalogRoutes.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fashion_catalog';
const PORT = process.env.PORT || 5002;

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI environment variable is required.');
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
    service: 'catalog-service',
    timestamp: new Date()
  });
});

app.use('/', catalogRoutes);

// Centralized error handler middleware
app.use((err, req, res, next) => {
  console.error('[Catalog Service Error Handler]', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Wait for database connection before listening
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Catalog DB Connected');
    app.listen(PORT, () => console.log(`🛍️ Catalog Service running on port ${PORT}`));
  })
  .catch(err => {
    console.error('FATAL Database Error: Failed to connect to MongoDB', err);
    process.exit(1);
  });
