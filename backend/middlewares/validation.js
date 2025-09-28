const { body, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

/**
 * Validation rules for user registration
 */
const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('phone')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Phone number must be at least 10 characters long'),
  
  body('nationality')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nationality must be at least 2 characters long'),
  
  body('fullname')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  handleValidationErrors
];

/**
 * Validation rules for user login
 */
const validateLogin = [
  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('Email or username is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

/**
 * Validation rules for password change
 */
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  handleValidationErrors
];

/**
 * Validation rules for password reset
 */
const validatePasswordReset = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  handleValidationErrors
];

/**
 * Validation rules for user info update
 */
const validateUserUpdate = [
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Phone number must be at least 10 characters long'),
  
  body('nationality')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nationality must be at least 2 characters long'),
  
  body('fullname')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  handleValidationErrors
];

/**
 * Validation rules for trade creation
 */
const validateTrade = [
  body('type')
    .isIn(['Starter', 'Pro', 'Elite'])
    .withMessage('Trade type must be either "buy" or "sell"'),

  body('amount')
    .isFloat({ min: 0.0000001 })
    .withMessage('Amount must be a positive number'),

  body('fee')
    .isFloat({ min: 0 })
    .withMessage('Fee must be a non-negative number'),

  body('duration')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Duration is required'),

  body('maturity_amount')
    .isFloat({ min: 0.0001 })
    .withMessage('Maturity amount must be a positive number'),

  body('maturity_date')
    .isISO8601()
    .withMessage('Maturity date must be a valid date'),

  body('profit')
    .isFloat()
    .withMessage('Profit must be a number'),

  body('date')
    .isISO8601()
    .withMessage('Date must be a valid date'),

  body('invoice')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Invoice is required'),

  body('notes')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),

  handleValidationErrors
];

/**
 * Validation rules for deposit/withdrawal
 */
const validateTransaction = [
  body('amount')
    .isFloat({ min: 0.0000001 })
    .withMessage('Amount must be a positive number'),
  
  body('method')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Payment method is required'),
  
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be 3 characters (e.g., USD)'),
  
  handleValidationErrors
];

/**
 * Validation rules for email sending
 */
const validateEmail = [
  body('to')
    .isEmail()
    .withMessage('Recipient email is required and must be valid'),
  
  body('subject')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject is required and must be less than 200 characters'),
  
  body('template')
    .isIn(['promotional', 'withdrawal', 'deposit', 'password-change', 'activation'])
    .withMessage('Template must be one of: promotional, withdrawal, deposit, password-change, activation'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validatePasswordChange,
  validatePasswordReset,
  validateUserUpdate,
  validateTrade,
  validateTransaction,
  validateEmail
}; 