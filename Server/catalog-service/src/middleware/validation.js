import { body, param, query, validationResult } from 'express-validator';

// Generic validation error handler mapping error to the structure: { success: false, message: 'first error msg' }
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg
    });
  }
  next();
};

export const getProductsRules = [
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  query('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be a number between 0 and 5'),
  query('priceMin').optional().isFloat({ min: 0 }).withMessage('Minimum price must be a positive number'),
  query('priceMax').optional().isFloat({ min: 0 }).withMessage('Maximum price must be a positive number'),
];

export const productIdParamRules = [
  param('id').isMongoId().withMessage('Invalid product ID format'),
];

export const productReviewsRules = [
  param('productId').isMongoId().withMessage('Invalid product ID format'),
];

export const addReviewRules = [
  body('productId').trim().isMongoId().withMessage('Invalid product ID format'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Review comment is required'),
  body('userName').optional().trim().notEmpty().withMessage('User name cannot be empty'),
];
