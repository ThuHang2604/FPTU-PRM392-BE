module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Notification', {
    NotificationID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    UserID: { type: DataTypes.INTEGER },
    Message: { type: DataTypes.TEXT },
    SentAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    IsRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    CreatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { tableName: 'Notification', timestamps: false });
};
