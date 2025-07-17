const authMiddleware = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/update-token', authMiddleware, authController.updateFcmToken);

module.exports = router;
