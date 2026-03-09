const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const {
  toggleDislike,
  getDislikeStatus
} = require('../controllers/dislikeConrtoller')


router.post('/:videoId/dislike', protect, toggleDislike)

//  статус
router.get('/:videoId/dislike-status', protect, getDislikeStatus)

module.exports = router
