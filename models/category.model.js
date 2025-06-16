module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Category', {
    CategoryID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    CategoryName: { type: DataTypes.STRING(100), allowNull: false },
  }, { tableName: 'Category', timestamps: false });
};
