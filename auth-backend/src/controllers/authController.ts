import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import User from '../models/User'

const generateToken = (id: number): string =>
  jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: (process.env.JWT_EXPIRE ?? '7d') as `${number}${'s'|'m'|'h'|'d'}` })

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, confirmPassword, avatar } = req.body

    if (password !== confirmPassword) {
      res.status(400).json({ errors: { confirmPassword: 'Passwords do not match' } })
      return
    }

    const existing = await User.findOne({ where: { email } })
    if (existing) {
      res.status(400).json({ errors: { email: 'User with this email already exists' } })
      return
    }

    const user = await User.create({ name, email, password, avatar: avatar ?? null })
    const token = generateToken(user.id)

    res.status(201).json({ success: true, message: 'Registration successful', token, user: user.toSafeObject() })
  } catch (error: unknown) {
    console.error('Registration error:', error)
    if (isSequelizeError(error)) {
      const errors: Record<string, string> = {}
      error.errors.forEach((e: { path: string; message: string }) => { errors[e.path] = e.message })
      res.status(400).json({ errors })
      return
    }
    res.status(500).json({ error: 'Server error during registration' })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ errors: { email: 'Invalid email or password' } })
      return
    }

    const token = generateToken(user.id)
    res.json({ success: true, message: 'Login successful', token, user: user.toSafeObject() })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Server error during login' })
  }
}

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.user!.id)
    if (!user) { res.status(404).json({ error: 'User not found' }); return }
    res.json({ success: true, user: user.toSafeObject() })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, avatar } = req.body
    const userId = req.user!.id

    const user = await User.findByPk(userId)
    if (!user) { res.status(404).json({ error: 'User not found' }); return }

    if (email && email !== user.email) {
      const taken = await User.findOne({ where: { email, id: { [Op.ne]: userId } } })
      if (taken) { res.status(400).json({ errors: { email: 'Email is already taken' } }); return }
    }

    const updateData: Partial<{ name: string; email: string; avatar: string | null }> = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (avatar !== undefined) updateData.avatar = avatar

    await user.update(updateData)
    const updated = await User.findByPk(userId)

    res.json({ success: true, message: 'Profile updated successfully', user: updated!.toSafeObject() })
  } catch (error: unknown) {
    console.error('Update profile error:', error)
    if (isSequelizeError(error)) {
      const errors: Record<string, string> = {}
      error.errors.forEach((e: { path: string; message: string }) => { errors[e.path] = e.message })
      res.status(400).json({ errors })
      return
    }
    res.status(500).json({ error: 'Server error' })
  }
}

export const logout = (_req: Request, res: Response): void => {
  res.json({ success: true, message: 'Logged out successfully' })
}

interface SequelizeValidationError {
  name: string
  errors: Array<{ path: string; message: string }>
}

function isSequelizeError(e: unknown): e is SequelizeValidationError {
  return (
    typeof e === 'object' &&
    e !== null &&
    'name' in e &&
    (e as { name: string }).name === 'SequelizeValidationError' ||
    (e as { name: string }).name === 'SequelizeUniqueConstraintError'
  )
}
