const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// Import all models
const User = require('./user.model')(sequelize, Sequelize.DataTypes);
const Category = require('./category.model')(sequelize, Sequelize.DataTypes);
const Product = require('./product.model')(sequelize, Sequelize.DataTypes);
const Cart = require('./cart.model')(sequelize, Sequelize.DataTypes);
const CartItem = require('./cartItem.model')(sequelize, Sequelize.DataTypes);
const Order = require('./order.model')(sequelize, Sequelize.DataTypes);
const OrderDetail = require('./orderDetail.model')(sequelize, Sequelize.DataTypes);
const Payment = require('./payment.model')(sequelize, Sequelize.DataTypes);
const Notification = require('./notification.model')(sequelize, Sequelize.DataTypes);
const ChatMessage = require('./chatMessage.model')(sequelize, Sequelize.DataTypes);
const StoreLocation = require('./storeLocation.model')(sequelize, Sequelize.DataTypes);

// Declare db object to export
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Assign models to db
db.User = User;
db.Category = Category;
db.Product = Product;
db.Cart = Cart;
db.CartItem = CartItem;
db.Order = Order;
db.OrderDetail = OrderDetail;
db.Payment = Payment;
db.Notification = Notification;
db.ChatMessage = ChatMessage;
db.StoreLocation = StoreLocation;

// ------------------------------------
// RELATIONSHIPS
// ------------------------------------

// Product belongs to Category
Product.belongsTo(Category, { foreignKey: 'CategoryID', as: 'category' });
Category.hasMany(Product, { foreignKey: 'CategoryID', as: 'products' });

// Cart belongs to User
Cart.belongsTo(User, { foreignKey: 'UserID' });
User.hasMany(Cart, { foreignKey: 'UserID' });

// CartItem belongs to Cart and Product
CartItem.belongsTo(Cart, { foreignKey: 'CartID' });
Cart.hasMany(CartItem, { foreignKey: 'CartID' });

CartItem.belongsTo(Product, { foreignKey: 'ProductID' });
Product.hasMany(CartItem, { foreignKey: 'ProductID' });

// Order belongs to User and Cart
Order.belongsTo(User, { foreignKey: 'UserID' });
User.hasMany(Order, { foreignKey: 'UserID' });

Order.belongsTo(Cart, { foreignKey: 'CartID' });
Cart.hasOne(Order, { foreignKey: 'CartID' });

// OrderDetail belongs to Order and Product
OrderDetail.belongsTo(Order, { foreignKey: 'OrderID' });
Order.hasMany(OrderDetail, { foreignKey: 'OrderID' });

OrderDetail.belongsTo(Product, { foreignKey: 'ProductID' });
Product.hasMany(OrderDetail, { foreignKey: 'ProductID' });

// Payment belongs to Order
Payment.belongsTo(Order, { foreignKey: 'OrderID' });
Order.hasOne(Payment, { foreignKey: 'OrderID' });

// Notification belongs to User
Notification.belongsTo(User, { foreignKey: 'UserID' });
User.hasMany(Notification, { foreignKey: 'UserID' });

// ChatMessage belongs to User
ChatMessage.belongsTo(User, { foreignKey: 'UserID' });
User.hasMany(ChatMessage, { foreignKey: 'UserID' });

module.exports = db;
