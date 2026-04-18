import type { Request, Response } from 'express'
import CommentLike from '../models/CommentLike'

export const getLikesCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await CommentLike.count({ where: { commentId: req.params.commentId as string } })
    res.json({ likes: count })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export const getLikeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const like = await CommentLike.findOne({ where: { userId: req.user!.id, commentId: req.params.commentId } })
    res.json({ liked: !!like })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const commentId = req.params.commentId as string
    const userId = req.user!.id

    const existing = await CommentLike.findOne({ where: { userId, commentId } })
    if (existing) {
      await existing.destroy()
      res.json({ liked: false })
    } else {
      await CommentLike.create({ userId, commentId })
      res.json({ liked: true })
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
