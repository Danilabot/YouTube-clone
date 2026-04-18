import type { Request, Response } from 'express'
import Dislike from '../models/Dislike'

export const toggleDislike = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const videoId = req.params.videoId as string

    const existing = await Dislike.findOne({ where: { userId, videoId } })
    let disliked: boolean

    if (existing) {
      await existing.destroy()
      disliked = false
    } else {
      await Dislike.create({ userId, videoId })
      disliked = true
    }

    const dislikesCount = await Dislike.count({ where: { videoId } })
    res.json({ success: true, disliked, dislikesCount })
  } catch (error) {
    console.error('Dislike error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getDislikeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const videoId = req.params.videoId as string
    const dislike = await Dislike.findOne({ where: { userId, videoId } })
    const dislikesCount = await Dislike.count({ where: { videoId } })
    res.json({ success: true, disliked: !!dislike, dislikesCount })
  } catch (error) {
    console.error('Dislike status error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}
