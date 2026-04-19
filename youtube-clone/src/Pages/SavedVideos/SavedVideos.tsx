import { getSavedVideos } from '../../api/saved'
import { useEffect, useState } from 'react'
import GridCell from '../../Components/Feed/GridCell'
import styles from './SavedVideo.module.css'
import { fetchVideoDetailsBatch } from '../../api/youtube'
import type { YouTubeVideo } from '../../types/youtube'

export const SavedVideo = () => {
  const [videosData, setVideosData] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSaved = async () => {
      try {
        const res = await getSavedVideos()
        const savedItems = res.savedVideos
        if (savedItems.length > 0) {
          const videoIds = savedItems.map((item) => item.videoId)
          const videos = await fetchVideoDetailsBatch(videoIds)
          setVideosData(videos)
        }
      } catch (error) {
        console.error('Ошибка загрузки сохранённых видео:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSaved()
  }, [])

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Сохранённые видео</h1>
        <div className={styles.grid}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonThumb} />
              <div className={styles.skeletonLine} style={{ width: '80%', height: 16 }} />
              <div className={styles.skeletonLine} style={{ width: '50%', height: 13 }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (videosData.length === 0) {
    return (
      <div className={styles.empty}>
        <svg viewBox="0 0 24 24" className={styles.emptyIcon}>
          <path fill="currentColor" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
        </svg>
        <h2>Нет сохранённых видео</h2>
        <p>Нажимайте «Сохранить» на понравившихся видео</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Сохранённые видео</h1>
      <div className={styles.grid}>
        {videosData.map((video) => (
          <GridCell key={video.id} item={video} />
        ))}
      </div>
    </div>
  )
}
