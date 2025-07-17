const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const profileController = require('../controllers/profile.controller');

// GET profile
router.get('/', authMiddleware, profileController.getProfile);

// PUT update profile
router.put('/', authMiddleware, profileController.updateProfile);

module.exports = router;
