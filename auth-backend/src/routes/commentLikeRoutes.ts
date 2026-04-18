import { Router } from 'express'
import { protect } from '../middleware/auth'
import { getLikesCount, getLikeStatus, toggleLike } from '../controllers/commentLikeController'

const router = Router()

router.get('/:commentId', getLikesCount)
router.get('/:commentId/like-status', protect, getLikeStatus)
router.post('/:commentId/like', protect, toggleLike)

export default router
