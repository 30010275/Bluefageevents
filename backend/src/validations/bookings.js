const { body } = require('express-validator');

const createBookingValidation = [
  body('eventType')
    .trim()
    .notEmpty().withMessage('Event type is required')
    .isIn(['wedding', 'corporate', 'birthday', 'anniversary', 'graduation', 'baby_shower', 'other'])
    .withMessage('Invalid event type'),
  body('eventDate')
    .notEmpty().withMessage('Event date is required')
    .isISO8601().withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ max: 500 }).withMessage('Location too long'),
  body('guestCount')
    .notEmpty().withMessage('Guest count is required')
    .isInt({ min: 1, max: 100000 }).withMessage('Guest count must be 1-100,000'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Notes too long'),
  body('packageId')
    .optional()
    .isUUID().withMessage('Invalid package ID'),
];

const updateBookingStatusValidation = [
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'])
    .withMessage('Invalid status'),
  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Notes too long'),
];

const updateBookingValidation = [
  body('eventType')
    .optional()
    .trim()
    .isIn(['wedding', 'corporate', 'birthday', 'anniversary', 'graduation', 'baby_shower', 'other'])
    .withMessage('Invalid event type'),
  body('eventDate')
    .optional()
    .isISO8601().withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Location too long'),
  body('guestCount')
    .optional()
    .isInt({ min: 1, max: 100000 }).withMessage('Guest count must be 1-100,000'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Notes too long'),
  body('packageId')
    .optional({ values: 'null' })
    .isUUID().withMessage('Invalid package ID'),
  body('status')
    .optional()
    .trim()
    .isIn(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'])
    .withMessage('Invalid status'),
  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Notes too long'),
];

module.exports = { createBookingValidation, updateBookingStatusValidation, updateBookingValidation };
