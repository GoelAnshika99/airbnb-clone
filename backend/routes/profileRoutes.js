const express = require('express');
const { updateProfile, getProfile } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();
router.get('/view', getProfile);
router.put('/update', upload.single('profilePicture'), updateProfile);
module.exports = router;