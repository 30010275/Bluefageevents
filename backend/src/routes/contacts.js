const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticate, authorize } = require('../middleware/auth');
const { formLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { createContactValidation, updateContactStatusValidation } = require('../validations/contact');

router.post('/', formLimiter, createContactValidation, validate, contactController.createContact);
router.get('/', authenticate, authorize('ADMIN'), contactController.getContacts);
router.get('/:id', authenticate, authorize('ADMIN'), contactController.getContact);
router.put('/:id', authenticate, authorize('ADMIN'), updateContactStatusValidation, validate, contactController.updateContactStatus);
router.delete('/:id', authenticate, authorize('ADMIN'), contactController.deleteContact);

module.exports = router;
