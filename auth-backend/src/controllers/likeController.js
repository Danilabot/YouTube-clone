const Like = require('../models/Like')

//  Поставить / убрать лайк
exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.id
    const { videoId } = req.params

    const existingLike = await Like.findOne({
      where: { userId, videoId }
    })

    let liked

    if (existingLike) {
      await existingLike.destroy()
      liked = false
    } else {
      await Like.create({ userId, videoId })
      liked = true
    }

    const likesCount = await Like.count({
      where: { videoId }
    })

    res.json({
      success: true,
      liked,
      likesCount
    })
  } catch (error) {
    console.error('Like error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

//  Получить статус лайка
exports.getLikeStatus = async (req, res) => {
  try {
    const userId = req.user.id
    const { videoId } = req.params

    const liked = await Like.findOne({
      where: { userId, videoId }
    })

    const likesCount = await Like.count({
      where: { videoId }
    })

    res.json({
      success: true,
      liked: !!liked,
      likesCount
    })
  } catch (error) {
    console.error('Like status error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}
