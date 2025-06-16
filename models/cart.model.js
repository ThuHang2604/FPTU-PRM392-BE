module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Cart', {
    CartID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    UserID: { type: DataTypes.INTEGER },
    TotalPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  }, { tableName: 'Cart', timestamps: false });
};
