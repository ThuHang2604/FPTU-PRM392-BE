module.exports = (sequelize, DataTypes) => {
  return sequelize.define('CartItem', {
    CartItemID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    CartID: { type: DataTypes.INTEGER },
    ProductID: { type: DataTypes.INTEGER },
    Quantity: { type: DataTypes.INTEGER, allowNull: false },
    Price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  }, { tableName: 'CartItems', timestamps: false });
};
