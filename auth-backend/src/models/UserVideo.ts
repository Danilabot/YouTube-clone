import { DataTypes, Model, type Optional } from 'sequelize'
import { sequelize } from '../config/database'

interface UserVideoAttributes {
  id: number
  userId: number
  title: string
  description: string | null
  videoUrl: string
  thumbnailUrl: string | null
  duration: number | null
  viewCount: number
  isPublic: boolean
}

type UserVideoCreationAttributes = Optional<
  UserVideoAttributes,
  'id' | 'description' | 'thumbnailUrl' | 'duration' | 'viewCount' | 'isPublic'
>

class UserVideo
  extends Model<UserVideoAttributes, UserVideoCreationAttributes>
  implements UserVideoAttributes
{
  declare id: number
  declare userId: number
  declare title: string
  declare description: string | null
  declare videoUrl: string
  declare thumbnailUrl: string | null
  declare duration: number | null
  declare viewCount: number
  declare isPublic: boolean
}

UserVideo.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: { len: { args: [1, 200], msg: 'Title must be 1–200 characters' } },
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    videoUrl: { type: DataTypes.TEXT, allowNull: false },
    thumbnailUrl: { type: DataTypes.TEXT, allowNull: true },
    duration: { type: DataTypes.INTEGER, allowNull: true },
    viewCount: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    isPublic: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
  },
  {
    sequelize,
    modelName: 'UserVideo',
    timestamps: true,
  },
)

export default UserVideo
