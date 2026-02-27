const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const {
  toggleLike,
  getLikeStatus
} = require('../controllers/likeController')

//  лайк / анлайк
router.post('/:videoId/like', protect, toggleLike)

//  статус
router.get('/:videoId/like-status', protect, getLikeStatus)

module.exports = router
