const express = require('express');
const { /*addProperty, */getAllProperties, getFilteredProperties, getPropertyById } = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
// router.post('/add', authMiddleware, addProperty);
router.get('/', getAllProperties);
router.get('/filter', getFilteredProperties);
router.get('/:propertyId', getPropertyById);
module.exports = router;