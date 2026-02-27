import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthProvider'
import styles from './SubscribeButton.module.css'

export const SubscribeButton = ({ channelId }) => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Получаем токен в начале компонента
  const token = localStorage.getItem('token')

  console.log('Token из user:', user?.token)
  console.log('Token из localStorage:', token)

  const checkSubscription = () => {
    if (!user) return
    
    fetch(`http://localhost:5000/api/subscriptions/status/${channelId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setIsSubscribed(data.isSubscribed))
      .catch(error => console.error('Ошибка проверки подписки:', error))
  }

  useEffect(() => {
    checkSubscription()
  }, [channelId, user])

  const handleSubscribe = () => {
    setLoading(true)

    if (!user) {
      alert('Нет авторизации')
      setLoading(false)
      return
    }

    const url = `http://localhost:5000/api/subscriptions/${channelId}`
    console.log('Отправляю запрос на:', url)

    fetch(url, {
      method: isSubscribed ? 'DELETE' : 'POST',
      headers: {
        Authorization: `Bearer ${token}`,  // ← теперь token доступен!
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log('Статус ответа:', res.status)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        setIsSubscribed(!isSubscribed)
      })
      .catch((error) => {
        console.error('Ошибка:', error)
        alert('Ошибка: ' + error.message)
      })
      .finally(() => setLoading(false))
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