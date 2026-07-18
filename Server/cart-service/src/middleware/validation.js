import { body, validationResult } from 'express-validator';

// Generic validation error handler that maps error to the structure: { success: false, message: 'first error msg' }
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

export const addToCartRules = [
  body('productId').trim().notEmpty().withMessage('Product ID is required'),
  body('variantSku').trim().notEmpty().withMessage('Variant SKU is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
];

export const updateCartQtyRules = [
  body('productId').trim().notEmpty().withMessage('Product ID is required'),
  body('variantSku').trim().notEmpty().withMessage('Variant SKU is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
];

export const applyCouponRules = [
  body('code').trim().notEmpty().withMessage('Coupon code is required'),
];

export const addressRules = [
  body('line1').trim().notEmpty().withMessage('Street address (line 1) is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pincode').trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage('Pincode must be a 6-digit number'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
];

export const updateAddressRules = [
  body('line1').optional().trim().notEmpty().withMessage('Street address cannot be empty'),
  body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
  body('state').optional().trim().notEmpty().withMessage('State cannot be empty'),
  body('pincode').optional().trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage('Pincode must be a 6-digit number'),
  body('phone').optional().trim().notEmpty().withMessage('Phone number cannot be empty'),
];
