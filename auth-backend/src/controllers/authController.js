const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Генерация JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Регистрация пользователя
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Проверяем совпадение паролей
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        errors: { confirmPassword: 'Passwords do not match' } 
      });
    }

    // Проверяем, существует ли пользователь
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ 
        errors: { email: 'User with this email already exists' } 
      });
    }

    // Создаем нового пользователя
    const user = await User.create({
      name,
      email,
      password // Пароль автоматически хешируется в хуке beforeCreate
    });

    // Генерируем токен
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Обработка ошибок валидации Sequelize
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = {};
      error.errors.forEach(err => {
        errors[err.path] = err.message;
      });
      return res.status(400).json({ errors });
    }
    
    res.status(500).json({ 
      error: 'Server error during registration' 
    });
  }
};

// Авторизация пользователя
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Находим пользователя по email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        errors: { email: 'Invalid email or password' } 
      });
    }

    // Проверяем пароль
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        errors: { password: 'Invalid email or password' } 
      });
    }

    // Генерируем токен
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Server error during login' 
    });
  }
};

// Получение профиля пользователя
exports.getProfile = async (req, res) => {
  try {
    // req.user.id устанавливается в middleware auth.js
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Обновление профиля
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;
    
    // Находим пользователя
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Если меняем email, проверяем что он не занят
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ 
        where: { 
          email,
          id: { [Op.ne]: userId } // Op.ne = not equal
        }
      });
      
      if (emailExists) {
        return res.status(400).json({ 
          errors: { email: 'Email is already taken' } 
        });
      }
    }

    // Обновляем данные
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    await user.update(updateData);

    // Получаем обновленного пользователя
    const updatedUser = await User.findByPk(userId);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser.toSafeObject()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = {};
      error.errors.forEach(err => {
        errors[err.path] = err.message;
      });
      return res.status(400).json({ errors });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// Выход из системы
exports.logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};