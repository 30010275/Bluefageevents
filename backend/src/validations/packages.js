const { body } = require('express-validator');

const createPackageValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Package name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description too long'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isDecimal({ min: 0 }).withMessage('Price must be a positive number'),
  body('features')
    .notEmpty().withMessage('Features are required')
    .isArray({ min: 1 }).withMessage('Features must be a non-empty array'),
  body('features.*')
    .isString().withMessage('Each feature must be a string')
    .trim()
    .notEmpty().withMessage('Feature cannot be empty'),
  body('isFeatured')
    .optional()
    .isBoolean().withMessage('isFeatured must be a boolean'),
  body('badge')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Badge too long'),
];

const updatePackageValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description too long'),
  body('price')
    .optional()
    .isDecimal({ min: 0 }).withMessage('Price must be a positive number'),
  body('features')
    .optional()
    .isArray({ min: 1 }).withMessage('Features must be a non-empty array'),
  body('isFeatured')
    .optional()
    .isBoolean().withMessage('isFeatured must be a boolean'),
  body('badge')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Badge too long'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
];

module.exports = { createPackageValidation, updatePackageValidation };
