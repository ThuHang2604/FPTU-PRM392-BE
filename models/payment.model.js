module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Payment', {
    PaymentID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    OrderID: { type: DataTypes.INTEGER },
    Amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    PaymentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    PaymentStatus: { type: DataTypes.ENUM('pending', 'paid', 'failed'), defaultValue: 'pending' },
  }, { tableName: 'Payment', timestamps: false });
};
