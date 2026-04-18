import { Router } from 'express'
import { protect } from '../middleware/auth'
import { getStatus, subscribe, unsubscribe, getMySubscriptions } from '../controllers/subscriptionController'

const wrap = (fn: Function) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next)

const router = Router()

router.get('/my', protect, wrap(getMySubscriptions))
router.get('/status/:channelId', protect, wrap(getStatus))
router.post('/:channelId', protect, wrap(subscribe))
router.delete('/:channelId', protect, wrap(unsubscribe))

export default router
