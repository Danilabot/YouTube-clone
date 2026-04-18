import { Router } from 'express'
import { protect } from '../middleware/auth'
import { saveVideo, unsaveVideo, getSavedVideos, getSaveStatus } from '../controllers/savedVideoController'

const router = Router()

router.use(protect)
router.post('/:videoId', saveVideo)
router.delete('/:videoId', unsaveVideo)
router.get('/', getSavedVideos)
router.get('/:videoId/status', getSaveStatus)

export default router
