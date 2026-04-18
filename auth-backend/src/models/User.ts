import { DataTypes, Model, type Optional } from 'sequelize'
import { sequelize } from '../config/database'
import bcrypt from 'bcryptjs'

interface UserAttributes {
  id: number
  name: string
  email: string
  password: string
  avatar: string | null
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'avatar'>

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number
  declare name: string
  declare email: string
  declare password: string
  declare avatar: string | null

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password)
  }

  toSafeObject(): Omit<UserAttributes, 'password'> {
    const { password: _p, ...safe } = this.get({ plain: true }) as UserAttributes
    return safe
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: { args: [2, 50], msg: 'Name must be between 2 and 50 characters' } },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: { msg: 'Please enter a valid email address' } },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: { args: [6, 100], msg: 'Password must be at least 6 characters' } },
    },
    avatar: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10)
          user.password = await bcrypt.hash(user.password, salt)
        }
      },
    },
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
)

export default User
