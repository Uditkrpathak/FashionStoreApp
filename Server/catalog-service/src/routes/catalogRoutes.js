import express from 'express';
import { 
  seedData, getCategories, getProducts, getProductById, addReview, getProductReviews,
  createProduct, updateProduct, deleteProduct, createCategory, updateCategory, deleteCategory,
  getAllReviewsAdmin, deleteReviewAdmin, toggleProductVisibility, bulkProductVisibility, updateInventory
} from '../controllers/catalogController.js';
import {
  validateRequest,
  getProductsRules,
  productIdParamRules,
  productReviewsRules,
  addReviewRules
} from '../middleware/validation.js';
import { requireAdmin, requirePermission } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Admin Catalog & Visibility Routes (Must be before /:id parameter routes)
router.get('/admin/reviews', requireAdmin, requirePermission('products.view'), getAllReviewsAdmin);
router.delete('/admin/reviews/:id', requireAdmin, requirePermission('products.edit'), deleteReviewAdmin);

router.post('/admin/products', requireAdmin, requirePermission('products.edit'), createProduct);
router.put('/admin/products/:id', requireAdmin, requirePermission('products.edit'), updateProduct);
router.patch('/admin/products/:id/visibility', requireAdmin, requirePermission('products.edit'), toggleProductVisibility);
router.post('/admin/products/bulk-visibility', requireAdmin, requirePermission('products.edit'), bulkProductVisibility);
router.patch('/admin/products/:id/inventory', requireAdmin, requirePermission('products.edit'), updateInventory);
router.delete('/admin/products/:id', requireAdmin, requirePermission('products.edit'), deleteProduct);

router.post('/admin/categories', requireAdmin, requirePermission('categories.edit'), createCategory);
router.put('/admin/categories/:id', requireAdmin, requirePermission('categories.edit'), updateCategory);
router.delete('/admin/categories/:id', requireAdmin, requirePermission('categories.edit'), deleteCategory);

// Public Routes
router.post('/seed', seedData);
router.get('/categories', getCategories);
router.get('/', getProductsRules, validateRequest, getProducts);
router.get('/:id', productIdParamRules, validateRequest, getProductById);
router.get('/:productId/reviews', productReviewsRules, validateRequest, getProductReviews);
router.post('/reviews', addReviewRules, validateRequest, addReview);

export default router;
