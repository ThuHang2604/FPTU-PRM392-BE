const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.delete('/clear', authMiddleware, cartController.clearCart);
router.post('/', authMiddleware, cartController.addToCart);
router.get('/', authMiddleware, cartController.getCart);
router.delete('/:productId', authMiddleware, cartController.removeFromCart);
router.put('/:productId', authMiddleware, cartController.updateCartItem);

module.exports = router;
