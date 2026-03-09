const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Dislike = sequelize.define('Dislike', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  videoId: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'videoId'] 
    }
  ]
})

module.exports = Dislike
