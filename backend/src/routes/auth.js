const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { registerValidation, loginValidation } = require('../validations/auth');

router.post('/register', authLimiter, registerValidation, validate, authController.register);
router.post('/login', authLimiter, loginValidation, validate, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

if (process.env.GOOGLE_CLIENT_ID) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
  router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5501'}?auth=failed` }, (err, user, info) => {
      if (err) {
        console.error('Google OAuth error:', err);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5501'}?auth=failed`);
      }
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5501'}?auth=failed`);
      }
      req.user = user;
      authController.googleCallback(req, res, next);
    })(req, res, next);
  });
}

module.exports = router;
