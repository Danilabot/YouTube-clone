const Dislike = require('../models/Dislike')

//  Поставить / убрать дизлайк
exports.toggleDislike = async (req, res) => {  
  try {
    const userId = req.user.id
    const { videoId } = req.params

    const existingDislike = await Dislike.findOne({
      where: { userId, videoId }
    })

    let disliked

    if (existingDislike) {
      await existingDislike.destroy()
      disliked = false
    } else {
      await Dislike.create({ userId, videoId })
      disliked = true
    }

    const dislikesCount = await Dislike.count({
      where: { videoId }
    })

    res.json({
      success: true,
      disliked,
      dislikesCount
    })
  } catch (error) {
    console.error('Dislike error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

//  Получить статус дизлайка
exports.getDislikeStatus = async (req, res) => {
  try {
    const userId = req.user.id
    const { videoId } = req.params

    const dislike = await Dislike.findOne({
      where: { userId, videoId }
    })

    const dislikesCount = await Dislike.count({
      where: { videoId }
    })

    res.json({
      success: true,
      disliked: !!dislike,
      dislikesCount
    })
  } catch (error) {
    console.error('Dislike status error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}