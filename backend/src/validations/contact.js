const { body } = require('express-validator');

const createContactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s+\-()]{7,20}$/).withMessage('Invalid phone number'),
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 3, max: 200 }).withMessage('Subject must be 3-200 characters'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Message must be 10-5000 characters'),
];

const updateContactStatusValidation = [
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['UNREAD', 'READ', 'ARCHIVED'])
    .withMessage('Invalid status'),
];

module.exports = { createContactValidation, updateContactStatusValidation };
