const { body } = require('express-validator');

const subscribeValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
];

module.exports = { subscribeValidation };
