import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { openAuthModal } from '../../redux/slices/uiSlice'
import { getHistory, clearHistory, type HistoryItem } from '../../utils/history'
import { getSavedVideos } from '../../api/saved'
import { fetchVideoDetailsBatch, fetchChannelsBatch } from '../../api/youtube'
import { getMySubscriptions } from '../../api/subscriptions'
import { formatDistanceToNow } from 'date-fns'
import styles from './UserProfile.module.css'
import type { YouTubeVideo, YouTubeChannel } from '../../types/youtube'

type Tab = 'history' | 'saved' | 'subscriptions'

export const UserProfile = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  const [tab, setTab] = useState<Tab>('history')
  const [history, setHistory] = useState<HistoryItem[]>(getHistory)
  const [savedVideos, setSavedVideos] = useState<YouTubeVideo[]>([])
  const [subscriptions, setSubscriptions] = useState<YouTubeChannel[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tab === 'saved' && savedVideos.length === 0) {
      setLoading(true)
      getSavedVideos()
        .then(async (res) => {
          const ids = res.savedVideos.map((v) => v.videoId)
          if (ids.length) {
            const videos = await fetchVideoDetailsBatch(ids)
            setSavedVideos(videos)
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
    if (tab === 'subscriptions' && subscriptions.length === 0) {
      setLoading(true)
      getMySubscriptions()
        .then(async (subs) => {
          const ids = subs.map((s) => s.channelId)
          if (ids.length) {
            const channels = await fetchChannelsBatch(ids)
            setSubscriptions(channels)
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [tab])

  if (!user) {
    return (
      <div className={styles.guest}>
        <div className={styles.guestIcon}>
          <svg viewBox="0 0 24 24" width="80" height="80" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <h2>Войдите в аккаунт</h2>
        <p>Чтобы видеть историю, сохранённые видео и подписки</p>
        <button className={styles.loginBtn} onClick={() => dispatch(openAuthModal('login'))}>
          Войти
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Шапка профиля */}
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className={styles.name}>{user.name}</h1>
          <p className={styles.email}>{user.email}</p>
        </div>
      </div>

      {/* Вкладки */}
      <div className={styles.tabs}>
        {(['history', 'saved', 'subscriptions'] as Tab[]).map((t) => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'history' && 'История'}
            {t === 'saved' && 'Сохранённые'}
            {t === 'subscriptions' && 'Подписки'}
          </button>
        ))}
      </div>

      {/* История */}
      {tab === 'history' && (
        <div>
          {history.length === 0 ? (
            <p className={styles.empty}>История пуста</p>
          ) : (
            <>
              <button className={styles.clearBtn} onClick={() => { clearHistory(); setHistory([]) }}>
                Очистить историю
              </button>
              <div className={styles.historyList}>
                {history.map((item) => (
                  <Link key={`${item.id}-${item.watchedAt}`} to={`/video/${item.categoryId}/${item.id}`} className={styles.historyItem}>
                    <img src={item.thumbnail} alt={item.title} className={styles.historyThumb} />
                    <div className={styles.historyInfo}>
                      <p className={styles.historyTitle}>{item.title}</p>
                      <p className={styles.historyChannel}>{item.channelTitle}</p>
                      <p className={styles.historyTime}>
                        {formatDistanceToNow(new Date(item.watchedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Сохранённые */}
      {tab === 'saved' && (
        <div>
          {loading ? (
            <p className={styles.empty}>Загрузка...</p>
          ) : savedVideos.length === 0 ? (
            <p className={styles.empty}>Нет сохранённых видео</p>
          ) : (
            <div className={styles.videoGrid}>
              {savedVideos.map((video) => (
                <Link key={video.id} to={`/video/${video.snippet.categoryId}/${video.id}`} className={styles.videoCard}>
                  <div className={styles.videoThumb}>
                    <img src={video.snippet.thumbnails.medium?.url} alt={video.snippet.title} />
                  </div>
                  <p className={styles.videoTitle}>{video.snippet.title}</p>
                  <p className={styles.videoChannel}>{video.snippet.channelTitle}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Подписки */}
      {tab === 'subscriptions' && (
        <div>
          {loading ? (
            <p className={styles.empty}>Загрузка...</p>
          ) : subscriptions.length === 0 ? (
            <p className={styles.empty}>Нет подписок</p>
          ) : (
            <div className={styles.channelList}>
              {subscriptions.map((ch) => (
                <Link key={ch.id} to={`/channel/${ch.id}`} className={styles.channelItem}>
                  <img src={ch.snippet.thumbnails.default?.url} alt={ch.snippet.title} className={styles.channelAvatar} />
                  <div>
                    <p className={styles.channelName}>{ch.snippet.title}</p>
                    <p className={styles.channelSubs}>
                      {Number(ch.statistics?.subscriberCount || 0).toLocaleString()} подписчиков
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
