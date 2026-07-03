const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { authenticate, authorize } = require('../middleware/auth');
const { formLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { createTestimonialValidation, updateTestimonialValidation } = require('../validations/testimonials');

router.get('/', testimonialController.getTestimonials);
router.get('/all', authenticate, authorize('ADMIN'), testimonialController.getAllTestimonials);
router.post('/', authenticate, formLimiter, createTestimonialValidation, validate, testimonialController.createTestimonial);
router.put('/:id', authenticate, authorize('ADMIN'), updateTestimonialValidation, validate, testimonialController.updateTestimonial);
router.delete('/:id', authenticate, authorize('ADMIN'), testimonialController.deleteTestimonial);

module.exports = router;
