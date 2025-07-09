const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const paymentController = require('../controllers/payment.controller');

router.post('/create', authMiddleware, paymentController.createPayment);
router.get('/vnpay_return', paymentController.vnpayReturn);
router.get('/info', authMiddleware, paymentController.getPaymentInfo);


module.exports = router;
