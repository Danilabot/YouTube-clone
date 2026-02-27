import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { API_KEY } from '../../utils/data'
import { value_converter } from '../../utils/data'
import styles from './Channel.module.css'
import { SubscribeButton } from '../../Components/SubscribeButton/SubscribeButton'
const Channel = () => {
  const { channelId } = useParams()

  const [channelInfo, setChannelInfo] = useState(null)
  const [channelVideos, setChannelVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('videos')

  // Получаю информацию о канале
  useEffect(() => {
    const fetchChannelInfo = async () => {
      try {
        const url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2Cstatistics%2CbrandingSettings&id=${channelId}&key=${API_KEY}`
        const response = await fetch(url)
        const data = await response.json()
        setChannelInfo(data.items[0])
      } catch (error) {
        console.error('Ошибка загрузки канала:', error)
      }
    }

    const fetchChannelVideos = async () => {
      try {
        // Сначала получаю ID последних видео канала
        const searchUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=20&order=date&type=video&key=${API_KEY}`
        const searchResponse = await fetch(searchUrl)
        const searchData = await searchResponse.json()

        // Получаем детали видео (статистику, длительность)
        const videoIds = searchData.items
          .map((item) => item.id.videoId)
          .join(',')
        const videosUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics%2CcontentDetails&id=${videoIds}&key=${API_KEY}`
        const videosResponse = await fetch(videosUrl)
        const videosData = await videosResponse.json()

        setChannelVideos(videosData.items)
      } catch (error) {
        console.error('Ошибка загрузки видео:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChannelInfo()
    fetchChannelVideos()
  }, [channelId])

  if (loading) return <div className={styles.loading}>Загрузка...</div>
  if (!channelInfo) return <div className={styles.error}>Канал не найден</div>

  const { snippet, statistics } = channelInfo

  return (
    <div className={styles.channel_page}>
      {/* ШАПКА КАНАЛА */}
      <div className={styles.channel_header}>
        {/* Баннер канала (если есть) */}
        {channelInfo.brandingSettings?.image?.bannerExternalUrl && (
          <div className={styles.channel_banner}>
            <img
              src={channelInfo.brandingSettings.image.bannerExternalUrl}
              alt="Channel banner"
            />
          </div>
        )}

        <div className={styles.channel_info}>
          <img
            src={snippet.thumbnails.high.url}
            alt={snippet.title}
            className={styles.channel_avatar}
          />

          <div className={styles.channel_details}>
            <h1>{snippet.title}</h1>
            <p className={styles.channel_handle}>
              @{snippet.customUrl || channelId}
            </p>

            <div className={styles.channel_stats}>
              <span>
                {value_converter(statistics.subscriberCount)} подписчиков
              </span>
              <span>•</span>
              <span>{value_converter(statistics.videoCount)} видео</span>
            </div>

            <p className={styles.channel_description}>
              {snippet.description?.slice(0, 150)}
              {snippet.description?.length > 150 && '...'}
            </p>
            <SubscribeButton channelId={channelId}/>
          </div>

          {/* Кнопка подписки */}
          <button channelId={channelId} />
        </div>
      </div>

      {/* ТАБЫ НАВИГАЦИИ */}
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

      {/* КОНТЕНТ В ЗАВИСИМОСТИ ОТ ТАБА */}
      <div className={styles.channel_content}>
        {activeTab === 'videos' && (
            
          <div className={styles.videos_grid}>
            {channelVideos.map((video) => (
              <div key={video.id} className={styles.video_card}>
                <img src={video.snippet.thumbnails.medium.url} />
                <h4>{video.snippet.title}</h4>
                <p>{value_converter(video.statistics.viewCount)} просмотров</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className={styles.about_tab}>
            <div className={styles.about_section}>
              <h3>Описание</h3>
              <p>{snippet.description || 'Нет описания'}</p>
            </div>

            <div className={styles.about_section}>
              <h3>Статистика</h3>
              <div className={styles.stats_grid}>
                <div className={styles.stat_item}>
                  <span>Дата регистрации</span>
                  <strong>
                    {new Date(snippet.publishedAt).toLocaleDateString()}
                  </strong>
                </div>
                <div className={styles.stat_item}>
                  <span>Всего просмотров</span>
                  <strong>{value_converter(statistics.viewCount)}</strong>
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
