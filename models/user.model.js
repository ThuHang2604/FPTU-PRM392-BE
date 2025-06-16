module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    UserID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    PasswordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    PhoneNumber: {
      type: DataTypes.STRING(20),
    },
    Address: {
      type: DataTypes.TEXT,
    },
    Role: {
      type: DataTypes.ENUM('customer', 'admin'),
      defaultValue: 'customer',
    },
    Status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  }, {
    tableName: 'Users',
    timestamps: false,
  });

  return User;
};
