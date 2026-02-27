const { Sequelize } = require('sequelize');
const path = require('path');

// Создаем подключение к SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'), // файл базы данных
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true, // автоматически добавляет createdAt и updatedAt
    underscored: false // использовать camelCase вместо snake_case
  }
});

const connectDB = async () => {
  try {
    // Проверяем подключение
    await sequelize.authenticate();
    console.log('✅ SQLite database connected successfully');
    
    // Синхронизируем модели с базой данных
    await sequelize.sync({ alter: true }); // alter: true обновит таблицы при изменениях
    console.log('✅ Database synchronized');
    
    return sequelize;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };