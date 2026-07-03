const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const { authenticate, authorize } = require('../middleware/auth');
const { formLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { subscribeValidation } = require('../validations/newsletter');

router.post('/', formLimiter, subscribeValidation, validate, newsletterController.subscribe);
router.get('/', authenticate, authorize('ADMIN'), newsletterController.getSubscribers);
router.post('/unsubscribe/:email', newsletterController.unsubscribe);

module.exports = router;
