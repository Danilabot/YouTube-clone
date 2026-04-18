import { Router } from 'express'
import { protect } from '../middleware/auth'
import { toggleDislike, getDislikeStatus } from '../controllers/dislikeController'

const router = Router()

router.post('/:videoId/dislike', protect, toggleDislike)
router.get('/:videoId/dislike-status', protect, getDislikeStatus)

export default router
