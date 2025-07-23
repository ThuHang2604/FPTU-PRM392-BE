const { Cart, CartItem, Product } = require('../models');
const admin = require('../config/firebaseService');
const { User } = require('../models');

exports.addToCart = async (req, res) => {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ where: { UserID: userId } });
        if (!cart) {
            cart = await Cart.create({ UserID: userId, TotalPrice: 0 });
        }

        const product = await Product.findByPk(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let item = await CartItem.findOne({
            where: { CartID: cart.CartID, ProductID: productId },
        });

        if (item) {
            item.Quantity += quantity;
            item.Price = product.Price;
            await item.save();
        } else {
            await CartItem.create({
                CartID: cart.CartID,
                ProductID: productId,
                Quantity: quantity,
                Price: product.Price,
            });
        }

        const allItems = await CartItem.findAll({ where: { CartID: cart.CartID } });
        const total = allItems.reduce((sum, i) => sum + i.Quantity * i.Price, 0);
        cart.TotalPrice = total;
        await cart.save();

        const user = await User.findByPk(userId);

        if (!user) {
            console.warn(`[FCM] User with ID: ${userId} can not be found`);
        } else if (!user.FcmToken) {
            console.warn(`[FCM] User ${user.Username} not have FcmToken`);
        } else {
            try {
                const message = {
                    token: user.FcmToken,
                    notification: {
                        title: '🛒 Giỏ hàng',
                        body: `Bạn vừa thêm "${product.ProductName}" vào giỏ hàng`,
                    },
                };

                const response = await admin.messaging().send(message);
                console.log(`[FCM] Send notification to user successfully ${user.Username}:`, response);
                await Notification.create({
                    UserID: userId,
                    Message: `Bạn vừa thêm "${product.ProductName}" vào giỏ hàng`,
                });
            } catch (fcmError) {
                console.error(`[FCM] Send notification to user fail ${user.Username}:`, fcmError.message || fcmError);
            }
        }

        res.status(200).json({ message: 'Added to cart successfully' });
    } catch (err) {
        console.error('[Add to Cart Error]', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.getCart = async (req, res) => {
    const userId = req.user.userId;
    try {
        const cart = await Cart.findOne({ where: { UserID: userId } });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const items = await CartItem.findAll({
            where: { CartID: cart.CartID },
            include: [{ model: Product }],
        });

        res.json({ cart, items });
    } catch (err) {
        console.error('[Get Cart Error]', err);
        res.status(500).json({ error: 'Error fetching cart' });
    }
};

exports.removeFromCart = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.params;

    try {
        const cart = await Cart.findOne({ where: { UserID: userId } });
        await CartItem.destroy({ where: { CartID: cart.CartID, ProductID: productId } });

        const allItems = await CartItem.findAll({ where: { CartID: cart.CartID } });
        const total = allItems.reduce((sum, i) => sum + i.Quantity * i.Price, 0);
        cart.TotalPrice = total;
        await cart.save();

        res.json({ message: 'Item removed' });
    } catch (err) {
        console.error('[Remove Item Error]', err);
        res.status(500).json({ error: 'Failed to remove item' });
    }
};

exports.updateCartItem = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findOne({ where: { UserID: userId } });

        const item = await CartItem.findOne({
            where: { CartID: cart.CartID, ProductID: productId },
        });

        if (!item) return res.status(404).json({ message: 'Item not found in cart' });

        item.Quantity = quantity;
        await item.save();

        const allItems = await CartItem.findAll({ where: { CartID: cart.CartID } });
        const total = allItems.reduce((sum, i) => sum + i.Quantity * i.Price, 0);
        cart.TotalPrice = total;
        await cart.save();

        res.json({ message: 'Quantity updated' });
    } catch (err) {
        console.error('[Update Cart Error]', err);
        res.status(500).json({ error: 'Failed to update item' });
    }
};
