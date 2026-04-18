import type { Request, Response, NextFunction } from 'express'
import { validateRegistration, validateLogin } from '../utils/validation'

export const validateRegisterInput = (req: Request, res: Response, next: NextFunction): void => {
  const { errors, isValid } = validateRegistration(req.body)
  if (!isValid) { res.status(400).json({ errors }); return }
  next()
}

export const validateLoginInput = (req: Request, res: Response, next: NextFunction): void => {
  const { errors, isValid } = validateLogin(req.body)
  if (!isValid) { res.status(400).json({ errors }); return }
  next()
}
