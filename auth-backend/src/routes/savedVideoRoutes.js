const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const {
  saveVideo,
  unsaveVideo,
  getSavedVideos,
  getSaveStatus
} = require('../controllers/savedVideoController')

// Все роуты защищены — требуют авторизации
router.use(protect)

// Сохранить видео
router.post('/:videoId', saveVideo)

// Удалить из сохранённых
router.delete('/:videoId', unsaveVideo)

// Получить список сохранённых
router.get('/', getSavedVideos)

// Проверить статус
router.get('/:videoId/status', getSaveStatus)

module.exports = router