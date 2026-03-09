import { getSavedVideos } from '../../api/saved'
import { useEffect, useState } from 'react'
import { API_KEY } from '../../utils/data'
import  GridCell  from '../../Components/Feed/GridCell'
import styles from './SavedVideo.module.css'
import { useAppSelector } from '../../redux/hooks'

interface User {
  name: string
  email: string
}
export const SavedVideo = () => {
  const [savedVideos, setSavedVideos] = useState<any[]>([])
  const [videosData, setVideosData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const user = useAppSelector(state => state.auth.user) as User | null
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const res = await getSavedVideos()
        setSavedVideos(res.savedVideos)
        
        if (res.savedVideos.length > 0) {
          await fetchVideosData(res.savedVideos)
        }
      } catch (error) {
        console.error('Ошибка загрузки сохранённых видео:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSaved()
  }, [])

  const fetchVideosData = async (savedItems: any[]) => {
    const promises = savedItems.map((item) =>
      fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${item.videoId}&key=${API_KEY}`,
      )
        .then((res) => res.json())
        .then((data) => data.items[0]),
    )
    const videos = await Promise.all(promises)
    setVideosData(videos.filter((v) => v))
  }

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
          <GridCell 
            key={video.id}
            item={video}
          />
        ))}
      </div>
    </div>
  )
}