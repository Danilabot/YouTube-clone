import { Router } from 'express'
import { protect } from '../middleware/auth'
import { toggleLike, getLikeStatus } from '../controllers/likeController'

const router = Router()

router.post('/:videoId/like', protect, toggleLike)
router.get('/:videoId/like-status', protect, getLikeStatus)

export default router
