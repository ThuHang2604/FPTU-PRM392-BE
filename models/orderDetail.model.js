module.exports = (sequelize, DataTypes) => {
  return sequelize.define('OrderDetail', {
    OrderDetailID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ProductID: { type: DataTypes.INTEGER },
    OrderID: { type: DataTypes.INTEGER },
    Price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  }, { tableName: 'OrderDetails', timestamps: false });
};
