import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './src/routes/authRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fashion_auth')
  .then(() => console.log('Auth DB Connected'))
  .catch(err => console.log('DB Error', err));

app.use('/', authRoutes);
app.use('/notifications', notificationRoutes);

app.listen(PORT, () => console.log(`🔒 Auth Service running on port ${PORT}`));
