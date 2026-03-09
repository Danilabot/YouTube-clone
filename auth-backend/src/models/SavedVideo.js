const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const SavedVideo = sequelize.define('SavedVideo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  videoId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  videoData: {
    type: DataTypes.JSON,  // сохраняем данные видео, чтобы не запрашивать каждый раз
    allowNull: true
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'videoId']
    }
  ]
})

module.exports = SavedVideo