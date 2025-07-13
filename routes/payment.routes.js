const express = require('express');
const router = express.Router();
const paymentCtrl = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/authMiddleware');

// Chỉ cần xác thực khi tạo order, không cần khi PayPal redirect lại
router.post('/paypal/create', authMiddleware, paymentCtrl.createPaypalOrder);
router.get('/paypal-success', paymentCtrl.capturePaypalOrder);
router.get('/paypal-cancel', (req, res) => res.send("❌ Giao dịch bị hủy"));

module.exports = router;
