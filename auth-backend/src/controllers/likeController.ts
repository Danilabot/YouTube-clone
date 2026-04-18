import type { Request, Response } from 'express'
import Like from '../models/Like'

export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const videoId = req.params.videoId as string

    const existing = await Like.findOne({ where: { userId, videoId } })
    let liked: boolean

    if (existing) {
      await existing.destroy()
      liked = false
    } else {
      await Like.create({ userId, videoId })
      liked = true
    }

    const likesCount = await Like.count({ where: { videoId } })
    res.json({ success: true, liked, likesCount })
  } catch (error) {
    console.error('Like error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getLikeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const videoId = req.params.videoId as string
    const liked = await Like.findOne({ where: { userId, videoId } })
    const likesCount = await Like.count({ where: { videoId } })
    res.json({ success: true, liked: !!liked, likesCount })
  } catch (error) {
    console.error('Like status error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}
