import { Router } from 'express'
import { protect } from '../middleware/auth'
import {
  createVideo,
  getMyVideos,
  getAllPublicVideos,
  getVideoById,
  deleteVideo,
} from '../controllers/userVideoController'

const router = Router()

router.get('/', getAllPublicVideos)
router.get('/my', protect, getMyVideos)
router.get('/:id', getVideoById)
router.post('/', protect, createVideo)
router.delete('/:id', protect, deleteVideo)

export default router
