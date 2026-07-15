import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import catalogRoutes from './src/routes/catalogRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5002;

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fashion_catalog')
  .then(() => console.log('Catalog DB Connected'))
  .catch(err => console.log('DB Error', err));

app.use('/', catalogRoutes);

app.listen(PORT, () => console.log(`🛍️ Catalog Service running on port ${PORT}`));
