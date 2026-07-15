import express from 'express';
import { seedData, getCategories, getProducts, getProductById, addReview, getProductReviews } from '../controllers/catalogController.js';

const router = express.Router();

router.post('/seed', seedData);
router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:productId/reviews', getProductReviews);
router.post('/reviews', addReview);

export default router;
