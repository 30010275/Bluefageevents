const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { authenticate, authorize } = require('../middleware/auth');
const { formLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { createQuoteValidation, updateQuoteValidation } = require('../validations/quotes');

router.post('/', authenticate, formLimiter, createQuoteValidation, validate, quoteController.createQuote);
router.get('/', authenticate, quoteController.getQuotes);
router.get('/:id', authenticate, quoteController.getQuote);
router.put('/:id', authenticate, authorize('ADMIN'), updateQuoteValidation, validate, quoteController.updateQuote);
router.delete('/:id', authenticate, authorize('ADMIN'), quoteController.deleteQuote);

module.exports = router;
