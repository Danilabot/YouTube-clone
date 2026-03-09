const SavedVideo = require('../models/SavedVideo')

// Сохранить видео
exports.saveVideo = async (req, res) => {
  try {
    const userId = req.user.id
    const { videoId } = req.params
    const { videoData } = req.body  // опционально, данные с YouTube

    const [saved, created] = await SavedVideo.findOrCreate({
      where: { userId, videoId },
      defaults: { videoData }
    })

    if (!created) {
      return res.status(400).json({ error: 'Video already saved' })
    }

    res.json({ 
      success: true, 
      saved: true,
      message: 'Video saved' 
    })
  } catch (error) {
    console.error('Save video error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Удалить из сохранённых
exports.unsaveVideo = async (req, res) => {
  try {
    const userId = req.user.id
    const { videoId } = req.params

    const deleted = await SavedVideo.destroy({
      where: { userId, videoId }
    })

    if (!deleted) {
      return res.status(404).json({ error: 'Video not found' })
    }

    res.json({ 
      success: true, 
      saved: false,
      message: 'Video removed' 
    })
  } catch (error) {
    console.error('Unsave video error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Получить список сохранённых видео
exports.getSavedVideos = async (req, res) => {
  try {
    const userId = req.user.id

    const savedVideos = await SavedVideo.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    })

    res.json({
      success: true,
      savedVideos
    })
  } catch (error) {
    console.error('Get saved videos error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// Проверить статус (сохранено ли видео)
exports.getSaveStatus = async (req, res) => {
  try {
    const userId = req.user.id
    const { videoId } = req.params

    const saved = await SavedVideo.findOne({
      where: { userId, videoId }
    })

    res.json({
      success: true,
      saved: !!saved
    })
  } catch (error) {
    console.error('Get save status error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}