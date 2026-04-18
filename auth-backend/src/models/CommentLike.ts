import { DataTypes, Model, type Optional } from 'sequelize'
import { sequelize } from '../config/database'

interface CommentLikeAttributes {
  id: number
  userId: number
  commentId: string
}

type CommentLikeCreationAttributes = Optional<CommentLikeAttributes, 'id'>

class CommentLike extends Model<CommentLikeAttributes, CommentLikeCreationAttributes> implements CommentLikeAttributes {
  declare id: number
  declare userId: number
  declare commentId: string
}

CommentLike.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
    commentId: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: 'CommentLike',
    indexes: [{ unique: true, fields: ['userId', 'commentId'] }],
  },
)

export default CommentLike
