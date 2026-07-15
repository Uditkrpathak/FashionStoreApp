import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import orderRoutes from './src/routes/orderRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5004;

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fashion_orders')
  .then(() => console.log('Orders DB Connected'))
  .catch(err => console.log('DB Error', err));

app.use('/', orderRoutes);

app.listen(PORT, () => console.log(`📦 Order Service running on port ${PORT}`));
