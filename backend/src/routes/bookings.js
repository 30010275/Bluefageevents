const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');
const { formLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { createBookingValidation, updateBookingStatusValidation, updateBookingValidation } = require('../validations/bookings');

router.post('/', authenticate, formLimiter, createBookingValidation, validate, bookingController.createBooking);
router.get('/', authenticate, bookingController.getBookings);
router.get('/mine', authenticate, bookingController.getMyBookings);
router.get('/:id', authenticate, bookingController.getBooking);
router.put('/:id/status', authenticate, authorize('ADMIN'), updateBookingStatusValidation, validate, bookingController.updateBookingStatus);
router.put('/:id', authenticate, updateBookingValidation, validate, bookingController.updateBooking);
router.delete('/:id', authenticate, authorize('ADMIN'), bookingController.deleteBooking);

module.exports = router;
