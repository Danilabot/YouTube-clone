import { DataTypes, Model, type Optional } from 'sequelize'
import { sequelize } from '../config/database'

interface DislikeAttributes {
  id: number
  userId: number
  videoId: string
}

type DislikeCreationAttributes = Optional<DislikeAttributes, 'id'>

class Dislike extends Model<DislikeAttributes, DislikeCreationAttributes> implements DislikeAttributes {
  declare id: number
  declare userId: number
  declare videoId: string
}

Dislike.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    videoId: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Dislike',
    indexes: [{ unique: true, fields: ['userId', 'videoId'] }],
  },
)

export default Dislike
