import { getSavedVideos } from '../../api/saved'
import { useEffect, useState } from 'react'
import GridCell from '../../Components/Feed/GridCell'
import styles from './SavedVideo.module.css'
import { useAppSelector } from '../../redux/hooks'
import { fetchVideoDetailsBatch } from '../../api/youtube'
import type { YouTubeVideo } from '../../types/youtube'

export const SavedVideo = () => {
  const [videosData, setVideosData] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const user = useAppSelector((state) => state.auth.user)

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
    return <div className={styles.loading}>Загрузка сохранённых видео...</div>
  }

  if (videosData.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>У вас пока нет сохранённых видео</h2>
        <p>Нажимайте кнопку "Сохранить" на понравившихся видео</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
      </div>
      <h1 className={styles.title}>Сохранённые видео</h1>
      <div className={styles.grid}>
        {videosData.map((video) => (
          <GridCell key={video.id} item={video} />
        ))}
      </div>
    </div>
  )
}
