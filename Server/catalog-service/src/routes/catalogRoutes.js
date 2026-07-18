import express from 'express';
import { seedData, getCategories, getProducts, getProductById, addReview, getProductReviews } from '../controllers/catalogController.js';
import {
  validateRequest,
  getProductsRules,
  productIdParamRules,
  productReviewsRules,
  addReviewRules
} from '../middleware/validation.js';

const router = express.Router();

router.post('/seed', seedData);
router.get('/categories', getCategories);
router.get('/', getProductsRules, validateRequest, getProducts);
router.get('/:id', productIdParamRules, validateRequest, getProductById);
router.get('/:productId/reviews', productReviewsRules, validateRequest, getProductReviews);
router.post('/reviews', addReviewRules, validateRequest, addReview);

export default router;
