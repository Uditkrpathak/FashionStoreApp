import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cartRoutes from './src/routes/cartRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5003;

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fashion_cart')
  .then(() => console.log('Cart DB Connected'))
  .catch(err => console.log('DB Error', err));

app.use('/', cartRoutes);

app.listen(PORT, () => console.log(`🛒 Cart Service running on port ${PORT}`));
