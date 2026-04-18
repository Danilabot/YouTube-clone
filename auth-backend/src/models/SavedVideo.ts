import { DataTypes, Model, type Optional } from 'sequelize'
import { sequelize } from '../config/database'

interface SavedVideoAttributes {
  id: number
  userId: number
  videoId: string
  videoData: object | null
}

type SavedVideoCreationAttributes = Optional<SavedVideoAttributes, 'id' | 'videoData'>

class SavedVideo extends Model<SavedVideoAttributes, SavedVideoCreationAttributes> implements SavedVideoAttributes {
  declare id: number
  declare userId: number
  declare videoId: string
  declare videoData: object | null
}

SavedVideo.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
    videoId: { type: DataTypes.STRING, allowNull: false },
    videoData: { type: DataTypes.JSON, allowNull: true },
  },
  {
    sequelize,
    modelName: 'SavedVideo',
    indexes: [{ unique: true, fields: ['userId', 'videoId'] }],
  },
)

export default SavedVideo
