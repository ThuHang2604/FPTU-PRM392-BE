module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ChatMessage', {
    ChatMessageID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    UserID: { type: DataTypes.INTEGER },
    Messages: { type: DataTypes.TEXT },
    SentAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { tableName: 'ChatMessages', timestamps: false });
};
