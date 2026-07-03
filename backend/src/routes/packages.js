const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createPackageValidation, updatePackageValidation } = require('../validations/packages');

router.get('/', packageController.getPackages);
router.get('/all', authenticate, authorize('ADMIN'), packageController.getAllPackages);
router.get('/:id', packageController.getPackage);
router.post('/', authenticate, authorize('ADMIN'), createPackageValidation, validate, packageController.createPackage);
router.put('/:id', authenticate, authorize('ADMIN'), updatePackageValidation, validate, packageController.updatePackage);
router.delete('/:id', authenticate, authorize('ADMIN'), packageController.deletePackage);

module.exports = router;
