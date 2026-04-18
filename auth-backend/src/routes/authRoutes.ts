import { Router } from 'express'
import { register, login, getProfile, updateProfile, logout } from '../controllers/authController'
import { protect } from '../middleware/auth'
import { validateRegisterInput, validateLoginInput } from '../middleware/validate'

const router = Router()

router.post('/register', validateRegisterInput, register)
router.post('/login', validateLoginInput, login)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.post('/logout', protect, logout)

export default router
