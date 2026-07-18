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

export const createOrderRules = [
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('items.*.productId').trim().isMongoId().withMessage('Invalid product ID in items'),
  body('items.*.qty').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('items.*.priceAtAdd').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.line1').trim().notEmpty().withMessage('Street address (line 1) is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode').trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage('Pincode must be a 6-digit number'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Phone number is required'),
  
  body('paymentMethod').isObject().withMessage('Payment method is required'),
  body('paymentMethod.type').trim().notEmpty().withMessage('Payment method type is required'),
];

export const orderIdParamRules = [
  param('id').isMongoId().withMessage('Invalid order ID format'),
];

export const cancelOrderRules = [
  param('id').isMongoId().withMessage('Invalid order ID format'),
  body('reason').optional().trim().notEmpty().withMessage('Reason cannot be empty'),
];

export const returnOrderRules = [
  param('id').isMongoId().withMessage('Invalid order ID format'),
  body('reason').optional().trim().notEmpty().withMessage('Reason cannot be empty'),
];

export const verifyPaymentRules = [
  body('razorpay_order_id').trim().notEmpty().withMessage('Razorpay order ID is required'),
  body('razorpay_payment_id').trim().notEmpty().withMessage('Razorpay payment ID is required'),
  body('razorpay_signature').trim().notEmpty().withMessage('Razorpay signature is required'),
];
