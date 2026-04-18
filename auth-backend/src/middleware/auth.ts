import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer')) {
    res.status(401).json({ success: false, error: 'Not authorized, no token provided' })
    return
  }

  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number }
    const user = await User.findByPk(decoded.id)
    if (!user) {
      res.status(401).json({ success: false, error: 'User not found or token is invalid' })
      return
    }
    req.user = user
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ success: false, error: 'Invalid token' })
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, error: 'Token expired' })
    } else {
      res.status(401).json({ success: false, error: 'Not authorized' })
    }
  }
}
