module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    ProductID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ProductName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    BriefDescription: {
      type: DataTypes.TEXT,
    },
    FullDescription: {
      type: DataTypes.TEXT,
    },
    TechnicalSpecification: {
      type: DataTypes.TEXT,
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    ImageURL: {
      type: DataTypes.TEXT,
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'Product',
    timestamps: false,
  });

  return Product;
};
