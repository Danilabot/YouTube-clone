const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Импортируем Op из Sequelize для операторов
const { Op } = require('sequelize');

const protect = async (req, res, next) => {
  let token;

  // Проверяем заголовок Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Получаем токен из заголовка
      token = req.headers.authorization.split(' ')[1];

      // Проверяем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Получаем пользователя из базы данных
      req.user = await User.findByPk(decoded.id);
      
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          error: 'User not found or token is invalid' 
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false,
          error: 'Invalid token' 
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          error: 'Token expired' 
        });
      }
      
      return res.status(401).json({ 
        success: false,
        error: 'Not authorized' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Not authorized, no token provided' 
    });
  }
};

// Middleware для проверки ролей (можно расширить в будущем)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Not authorized' 
      });
    }
    
    // Если в будущем добавлю роли, можно проверять здесь
    // if (!roles.includes(req.user.role)) {
    //   return res.status(403).json({
    //     success: false,
    //     error: `Role ${req.user.role} is not authorized to access this route`
    //   });
    // }
    
    next();
  };
};

module.exports = { protect, authorize };