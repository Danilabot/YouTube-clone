const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/auth')
const Subscription = require('../models/Subscription')

// Проверить статус подписки
router.get('/status/:channelId', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: {
        userId: req.user.id,
        channelId: req.params.channelId
      }
    })
    
    res.json({ isSubscribed: !!subscription })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Подписаться
router.post('/:channelId', protect, async (req, res) => {
  try {
    const subscription = await Subscription.create({
      userId: req.user.id,
      channelId: req.params.channelId
    })
    
    res.status(201).json({ message: 'Подписка оформлена', subscription })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Отписаться
router.delete('/:channelId', protect, async (req, res) => {
  try {
    await Subscription.destroy({
      where: {
        userId: req.user.id,
        channelId: req.params.channelId
      }
    })
    
    res.json({ message: 'Подписка отменена' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Получить все подписки пользователя
router.get('/my', protect, async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      where: { userId: req.user.id }
    })
    
    res.json(subscriptions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router