const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getLikesCount,
  getLikeStatus,
  toggleLike
} = require('../controllers/commentLikeController');

// Получить количество лайков
router.get('/:commentId', getLikesCount);

// Получить статус лайка
router.get('/:commentId/like-status', protect, getLikeStatus);

// Поставить/убрать лайк
router.post('/:commentId/like', protect, toggleLike);

module.exports = router;