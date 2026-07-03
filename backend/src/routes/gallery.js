const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../config/multer');
const validate = require('../middleware/validate');
const { createGalleryValidation, updateGalleryValidation } = require('../validations/gallery');

router.get('/', galleryController.getGallery);
router.post('/', authenticate, authorize('ADMIN'), upload.single('image'), createGalleryValidation, validate, galleryController.createGalleryItem);
router.put('/:id', authenticate, authorize('ADMIN'), upload.single('image'), updateGalleryValidation, validate, galleryController.updateGalleryItem);
router.delete('/:id', authenticate, authorize('ADMIN'), galleryController.deleteGalleryItem);

module.exports = router;
