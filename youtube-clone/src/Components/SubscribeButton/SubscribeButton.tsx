import { useEffect, useState } from 'react'
import styles from './SubscribeButton.module.css'
import { useAppSelector } from '../../redux/hooks'
import {
  getSubscriptionStatus,
  subscribeToChannel,
  unsubscribeFromChannel,
} from '../../api/subscriptions'
import toast from 'react-hot-toast'

interface SubscribeButtonProps {
  channelId: string
}

export const SubscribeButton = ({ channelId }: SubscribeButtonProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.auth.user)

  useEffect(() => {
    if (!user) return
    getSubscriptionStatus(channelId)
      .then((data) => setIsSubscribed(data.isSubscribed))
      .catch((error) => console.error('Ошибка проверки подписки:', error))
  }, [channelId, user])

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Войдите в аккаунт')
      return
    }

    setLoading(true)
    try {
      if (isSubscribed) {
        await unsubscribeFromChannel(channelId)
      } else {
        await subscribeToChannel(channelId)
      }
      setIsSubscribed((prev) => !prev)
    } catch (error) {
      toast.error('Ошибка: ' + (error instanceof Error ? error.message : 'неизвестная ошибка'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={`${styles.subscribe_btn} ${isSubscribed ? styles.subscribed : ''}`}
    >
      {loading ? '...' : isSubscribed ? 'Вы подписаны' : 'Подписаться'}
    </button>
  )
}
