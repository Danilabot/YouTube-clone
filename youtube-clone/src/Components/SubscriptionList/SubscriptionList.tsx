import { useEffect, useState } from 'react'
import styles from './SubscriptionList.module.css'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../redux/hooks'
import { getMySubscriptions } from '../../api/subscriptions'
import { fetchChannelsBatch } from '../../api/youtube'
import type { YouTubeChannel } from '../../types/youtube'

export const SubscriptionList = () => {
  const user = useAppSelector((state) => state.auth.user)
  const [channelsInfo, setChannelsInfo] = useState<YouTubeChannel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setChannelsInfo([])
      setLoading(false)
      return
    }

    const loadSubscriptions = async () => {
      try {
        const subscriptions = await getMySubscriptions()
        const channelIds = subscriptions.map((sub) => sub.channelId)
        const channels = await fetchChannelsBatch(channelIds)
        setChannelsInfo(channels)
      } catch (error) {
        console.error('Ошибка загрузки подписок:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSubscriptions()
  }, [user])

  if (loading) return <div>Loading.....</div>

  return (
    <div className={styles.subscriptions}>
      {!user || channelsInfo.length === 0 ? (
        <p className={styles.empty}>Нет подписок</p>
      ) : (
        <ul className={styles.list}>
          {channelsInfo.map((channel) => (
            <li key={channel.id} className={styles.item}>
              <Link to={`/channel/${channel.id}`} className={`${styles.link} side-link`}>
                <img
                  src={channel.snippet.thumbnails.default?.url}
                  alt={channel.snippet.title}
                  className={styles.avatar}
                />
                <p className={styles.name}>{channel.snippet.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
