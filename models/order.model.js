module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Order', {
    OrderID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    OrderStatus: { type: DataTypes.ENUM('unpaid', 'paid', 'cancelled'), defaultValue: 'unpaid' },
    OrderDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    UserID: { type: DataTypes.INTEGER },
    CartID: { type: DataTypes.INTEGER },
  }, { tableName: 'Orders', timestamps: false });
};
