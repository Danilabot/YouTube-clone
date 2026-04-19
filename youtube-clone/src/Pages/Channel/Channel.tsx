import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { formatNumber } from '../../utils/formatNumber'
import styles from './Channel.module.css'
import { SubscribeButton } from '../../Components/SubscribeButton/SubscribeButton'
import { fetchChannelDetails, fetchChannelVideos } from '../../api/youtube'
import type { YouTubeChannel, YouTubeVideo } from '../../types/youtube'

type TabType = 'videos' | 'about'

const Channel = () => {
  const { channelId } = useParams<{ channelId: string }>()
  const [channelInfo, setChannelInfo] = useState<YouTubeChannel | null>(null)
  const [channelVideos, setChannelVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('videos')
  const [descExpanded, setDescExpanded] = useState(false)

  useEffect(() => {
    if (!channelId) return
    setLoading(true)
    const loadChannelData = async () => {
      try {
        const [info, videos] = await Promise.all([
          fetchChannelDetails(channelId),
          fetchChannelVideos(channelId),
        ])
        setChannelInfo(info)
        setChannelVideos(videos)
      } catch (error) {
        console.error('Ошибка загрузки канала:', error)
      } finally {
        setLoading(false)
      }
    }
    loadChannelData()
  }, [channelId])

  if (loading) {
    return (
      <div className={styles.channel_page}>
        <div className={styles.skeletonBanner} />
        <div className={styles.skeletonInfo}>
          <div className={styles.skeletonAvatar} />
          <div className={styles.skeletonDetails}>
            <div className={styles.skeletonLine} style={{ width: 200, height: 24 }} />
            <div className={styles.skeletonLine} style={{ width: 120, height: 14 }} />
            <div className={styles.skeletonLine} style={{ width: 180, height: 14 }} />
          </div>
        </div>
      </div>
    )
  }

  if (!channelInfo || !channelId) {
    return <div className={styles.error}>Канал не найден</div>
  }

  const { snippet, statistics } = channelInfo
  const desc = snippet.description ?? ''
  const SHORT_DESC = 150

  return (
    <div className={styles.channel_page}>
      <div className={styles.channel_header}>
        {channelInfo.brandingSettings?.image?.bannerExternalUrl && (
          <div className={styles.channel_banner}>
            <img src={channelInfo.brandingSettings.image.bannerExternalUrl} alt="Баннер канала" />
          </div>
        )}

        <div className={styles.channel_info}>
          <img
            src={snippet.thumbnails.high?.url}
            alt={snippet.title}
            className={styles.channel_avatar}
          />

          <div className={styles.channel_details}>
            <h1>{snippet.title}</h1>
            <p className={styles.channel_handle}>@{snippet.customUrl || channelId}</p>

            <div className={styles.channel_stats}>
              <span>{formatNumber(statistics.subscriberCount)} подписчиков</span>
              <span>·</span>
              <span>{formatNumber(statistics.videoCount)} видео</span>
            </div>

            {desc && (
              <p className={styles.channel_description}>
                {descExpanded || desc.length <= SHORT_DESC
                  ? desc
                  : desc.slice(0, SHORT_DESC) + '...'}
                {desc.length > SHORT_DESC && (
                  <button
                    className={styles.descToggle}
                    onClick={() => setDescExpanded((p) => !p)}
                  >
                    {descExpanded ? ' Свернуть' : ' Ещё'}
                  </button>
                )}
              </p>
            )}

            <SubscribeButton channelId={channelId} />
          </div>
        </div>
      </div>

      <div className={styles.channel_tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'videos' ? styles.active : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          Видео
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'about' ? styles.active : ''}`}
          onClick={() => setActiveTab('about')}
        >
          О канале
        </button>
      </div>

      <div className={styles.channel_content}>
        {activeTab === 'videos' && (
          <div className={styles.videos_grid}>
            {channelVideos.map((video) => (
              <Link key={video.id} to={`/video/${video.snippet.categoryId}/${video.id}`}>
                <div className={styles.video_card}>
                  <img src={video.snippet.thumbnails.medium?.url} alt={video.snippet.title} />
                  <h4>{video.snippet.title}</h4>
                  <p>{formatNumber(video.statistics.viewCount)} просмотров</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className={styles.about_tab}>
            <div className={styles.about_section}>
              <h3>Описание</h3>
              <p>{desc || 'Нет описания'}</p>
            </div>
            <div className={styles.about_section}>
              <h3>Статистика</h3>
              <div className={styles.stats_grid}>
                <div className={styles.stat_item}>
                  <span>Дата регистрации</span>
                  <strong>{new Date(snippet.publishedAt).toLocaleDateString('ru-RU')}</strong>
                </div>
                <div className={styles.stat_item}>
                  <span>Всего просмотров</span>
                  <strong>{formatNumber(statistics.viewCount)}</strong>
                </div>
                <div className={styles.stat_item}>
                  <span>Подписчики</span>
                  <strong>{formatNumber(statistics.subscriberCount)}</strong>
                </div>
                <div className={styles.stat_item}>
                  <span>Видео</span>
                  <strong>{formatNumber(statistics.videoCount)}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Channel
