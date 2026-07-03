const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/bookings', require('./bookings'));
router.use('/quotes', require('./quotes'));
router.use('/contacts', require('./contacts'));
router.use('/newsletter', require('./newsletter'));
router.use('/gallery', require('./gallery'));
router.use('/blogs', require('./blog'));
router.use('/testimonials', require('./testimonials'));
router.use('/packages', require('./packages'));

module.exports = router;
