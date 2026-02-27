const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [2, 50],
        msg: 'Name must be between 2 and 50 characters'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: 'email',
      msg: 'Email already exists'
    },
    validate: {
      isEmail: {
        msg: 'Please enter a valid email address'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: 'Password must be at least 6 characters'
      }
    }
  }
}, {
  // Хуки (обработчики событий)
  hooks: {
    // Перед созданием пользователя
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    // Перед обновлением пользователя
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  // Отключаем автоматические timestamp, будем создавать свои
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Метод для сравнения паролей
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Метод для безопасного представления пользователя (без пароля)
User.prototype.toSafeObject = function() {
  const values = this.get({ plain: true });
  delete values.password;
  return values;
};

module.exports = User;