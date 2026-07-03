const { body } = require('express-validator');

const createQuoteValidation = [
  body('eventType')
    .trim()
    .notEmpty().withMessage('Event type is required')
    .isIn(['wedding', 'corporate', 'birthday', 'anniversary', 'graduation', 'baby_shower', 'other'])
    .withMessage('Invalid event type'),
  body('budget')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Budget too long'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be 10-5000 characters'),
];

const updateQuoteValidation = [
  body('status')
    .optional()
    .trim()
    .isIn(['PENDING', 'RESPONDED', 'COMPLETED'])
    .withMessage('Invalid status'),
  body('adminResponse')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Response too long'),
];

module.exports = { createQuoteValidation, updateQuoteValidation };
