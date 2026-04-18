import type { Request, Response } from 'express'
import Subscription from '../models/Subscription'

export const getStatus = async (req: Request, res: Response): Promise<void> => {
  const subscription = await Subscription.findOne({ where: { userId: req.user!.id, channelId: req.params.channelId } })
  res.json({ isSubscribed: !!subscription })
}

export const subscribe = async (req: Request, res: Response): Promise<void> => {
  const [subscription, created] = await Subscription.findOrCreate({
    where: { userId: req.user!.id, channelId: req.params.channelId },
  })
  res.status(created ? 201 : 200).json({ isSubscribed: true, subscription })
}

export const unsubscribe = async (req: Request, res: Response): Promise<void> => {
  await Subscription.destroy({ where: { userId: req.user!.id, channelId: req.params.channelId } })
  res.json({ isSubscribed: false })
}

export const getMySubscriptions = async (req: Request, res: Response): Promise<void> => {
  const subscriptions = await Subscription.findAll({ where: { userId: req.user!.id } })
  res.json(subscriptions)
}
