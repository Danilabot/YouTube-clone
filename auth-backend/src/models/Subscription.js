const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Subscription = sequelize.define(
  'Subscription',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    channelId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Уникальность: один пользователь может подписаться на канал только один раз
    indexes: [
      {
        unique: true,
        fields: ['userId', 'channelId'],
      },
    ],
  },
)

module.exports = Subscription
