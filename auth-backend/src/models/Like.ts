import { DataTypes, Model, type Optional } from 'sequelize'
import { sequelize } from '../config/database'

interface LikeAttributes {
  id: number
  userId: number
  videoId: string
}

type LikeCreationAttributes = Optional<LikeAttributes, 'id'>

class Like extends Model<LikeAttributes, LikeCreationAttributes> implements LikeAttributes {
  declare id: number
  declare userId: number
  declare videoId: string
}

Like.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    videoId: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Like',
    indexes: [{ unique: true, fields: ['userId', 'videoId'] }],
  },
)

export default Like
