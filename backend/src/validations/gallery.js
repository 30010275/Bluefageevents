const { body } = require('express-validator');

const createGalleryValidation = [
  body('caption')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Caption too long'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Category too long'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 }).withMessage('Sort order must be a positive integer'),
];

const updateGalleryValidation = [
  body('caption')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Caption too long'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Category too long'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 }).withMessage('Sort order must be a positive integer'),
];

module.exports = { createGalleryValidation, updateGalleryValidation };
