const express = require('express');
const { bookProperty, getBookingHistory } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
router.post('/:propertyId', authMiddleware, bookProperty);
router.get('/history', authMiddleware, getBookingHistory);
module.exports = router;