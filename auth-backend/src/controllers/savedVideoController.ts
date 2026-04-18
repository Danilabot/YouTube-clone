import type { Request, Response } from 'express'
import SavedVideo from '../models/SavedVideo'

export const saveVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const videoId = req.params.videoId as string
    const { videoData } = req.body

    const [, created] = await SavedVideo.findOrCreate({
      where: { userId, videoId },
      defaults: { userId, videoId, videoData },
    })

    if (!created) { res.status(400).json({ error: 'Video already saved' }); return }
    res.json({ success: true, saved: true, message: 'Video saved' })
  } catch (error) {
    console.error('Save video error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const unsaveVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const videoId = req.params.videoId as string
    const deleted = await SavedVideo.destroy({ where: { userId, videoId } })
    if (!deleted) { res.status(404).json({ error: 'Video not found' }); return }
    res.json({ success: true, saved: false, message: 'Video removed' })
  } catch (error) {
    console.error('Unsave video error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getSavedVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const savedVideos = await SavedVideo.findAll({
      where: { userId: req.user!.id },
      order: [['createdAt', 'DESC']],
    })
    res.json({ success: true, savedVideos })
  } catch (error) {
    console.error('Get saved videos error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getSaveStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const saved = await SavedVideo.findOne({ where: { userId: req.user!.id, videoId: req.params.videoId } })
    res.json({ success: true, saved: !!saved })
  } catch (error) {
    console.error('Get save status error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}
