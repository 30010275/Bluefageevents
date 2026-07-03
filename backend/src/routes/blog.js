const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../config/multer');
const validate = require('../middleware/validate');
const { createBlogValidation, updateBlogValidation } = require('../validations/blog');

router.get('/', blogController.getBlogs);
router.get('/all', authenticate, authorize('ADMIN'), blogController.getAllBlogsAdmin);
router.get('/:slug', blogController.getBlog);
router.post('/', authenticate, authorize('ADMIN'), upload.single('coverImage'), createBlogValidation, validate, blogController.createBlog);
router.put('/:id', authenticate, authorize('ADMIN'), upload.single('coverImage'), updateBlogValidation, validate, blogController.updateBlog);
router.delete('/:id', authenticate, authorize('ADMIN'), blogController.deleteBlog);

module.exports = router;
