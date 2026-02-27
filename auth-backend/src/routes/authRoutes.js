const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  logout 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { 
  validateRegisterInput, 
  validateLoginInput 
} = require('../middleware/validate');

// Публичные маршруты
router.post('/register', validateRegisterInput, register);
router.post('/login', validateLoginInput, login);

// Защищенные маршруты (требуют аутентификации)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

module.exports = router;