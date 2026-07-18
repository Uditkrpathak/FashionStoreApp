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

export const loginRules = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const registerRules = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

export const verifyOtpRules = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('code').trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be a 6-digit number'),
];

export const forgotPasswordRules = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
];

export const resetPasswordRules = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

export const updateProfileRules = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional({ checkFalsy: true }),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
];

export const addressRules = [
  body('line1').trim().notEmpty().withMessage('Street address (line 1) is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pincode').trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage('Pincode must be a 6-digit number'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
];

export const updateAddressRules = [
  body('line1').optional().trim().notEmpty().withMessage('Street address (line 1) cannot be empty'),
  body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
  body('state').optional().trim().notEmpty().withMessage('State cannot be empty'),
  body('pincode').optional().trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage('Pincode must be a 6-digit number'),
  body('phone').optional().trim().notEmpty().withMessage('Phone number cannot be empty'),
];

export const wishlistRules = [
  body('productId').trim().notEmpty().withMessage('Product ID is required'),
];
