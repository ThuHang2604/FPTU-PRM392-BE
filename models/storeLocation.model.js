module.exports = (sequelize, DataTypes) => {
  return sequelize.define('StoreLocation', {
    LocationID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Latitude: { type: DataTypes.DECIMAL(10, 6) },
    Longitude: { type: DataTypes.DECIMAL(10, 6) },
    Address: { type: DataTypes.TEXT },
  }, { tableName: 'StoreLocation', timestamps: false });
};
