import { DataTypes, Model, type Optional } from 'sequelize'
import { sequelize } from '../config/database'

interface SubscriptionAttributes {
  id: number
  userId: number
  channelId: string
}

type SubscriptionCreationAttributes = Optional<SubscriptionAttributes, 'id'>

class Subscription extends Model<SubscriptionAttributes, SubscriptionCreationAttributes> implements SubscriptionAttributes {
  declare id: number
  declare userId: number
  declare channelId: string
}

Subscription.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
    channelId: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Subscription',
    indexes: [{ unique: true, fields: ['userId', 'channelId'] }],
  },
)

export default Subscription
