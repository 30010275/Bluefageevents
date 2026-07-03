const { body } = require('express-validator');

const createTestimonialValidation = [
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Content must be 10-2000 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('eventType')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Event type too long'),
];

const updateTestimonialValidation = [
  body('status')
    .optional()
    .trim()
    .isIn(['PENDING', 'APPROVED', 'REJECTED'])
    .withMessage('Invalid status'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 }).withMessage('Content must be 10-2000 characters'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
];

module.exports = { createTestimonialValidation, updateTestimonialValidation };
