import type { Request, Response } from 'express'
import UserVideo from '../models/UserVideo'
import User from '../models/User'

export const createVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const { title, description, videoUrl, thumbnailUrl, duration } = req.body

    if (!title?.trim() || !videoUrl) {
      res.status(400).json({ error: 'Название и ссылка на видео обязательны' })
      return
    }

    const video = await UserVideo.create({
      userId,
      title: title.trim(),
      description: description?.trim() || null,
      videoUrl,
      thumbnailUrl: thumbnailUrl || null,
      duration: duration ?? null,
    })

    res.status(201).json({ success: true, video })
  } catch (error) {
    console.error('Create video error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getMyVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const videos = await UserVideo.findAll({
      where: { userId: req.user!.id },
      order: [['createdAt', 'DESC']],
    })
    res.json({ success: true, videos })
  } catch (error) {
    console.error('Get my videos error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getAllPublicVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const videos = await UserVideo.findAll({
      where: { isPublic: true },
      order: [['createdAt', 'DESC']],
      limit: 50,
    })

    const userIds = [...new Set(videos.map((v) => v.userId))]
    const users = await User.findAll({ where: { id: userIds }, attributes: ['id', 'name', 'avatar'] })
    const userMap = Object.fromEntries(users.map((u) => [u.id, u.toSafeObject()]))

    const result = videos.map((v) => ({
      ...v.toJSON(),
      author: userMap[v.userId] ?? null,
    }))

    res.json({ success: true, videos: result })
  } catch (error) {
    console.error('Get public videos error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getVideoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const video = await UserVideo.findByPk(id)
    if (!video || !video.isPublic) {
      res.status(404).json({ error: 'Видео не найдено' })
      return
    }

    await video.increment('viewCount')

    const user = await User.findByPk(video.userId, { attributes: ['id', 'name', 'avatar'] })
    res.json({ success: true, video: { ...video.toJSON(), author: user?.toSafeObject() ?? null } })
  } catch (error) {
    console.error('Get video error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const deleteVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const video = await UserVideo.findOne({ where: { id, userId } })
    if (!video) {
      res.status(404).json({ error: 'Видео не найдено' })
      return
    }

    await video.destroy()
    res.json({ success: true, deleted: true })
  } catch (error) {
    console.error('Delete video error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}
