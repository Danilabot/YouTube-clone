import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { API_KEY } from '../../utils/data'
import GridCell from '../../Components/Feed/GridCell'
import styles from './SearchResults.module.css'
import Sidebar from '../../Components/Sidebar/Sidebar'

export const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const searchVideos = async () => {
    if (!query) return
    setLoading(true)

    const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=20&key=${API_KEY}`

    try {
      const res = await fetch(url)
      const data = await res.json()
      setVideos(data.items || [])
    } catch (error) {
      console.error('Ошибка поиска:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    searchVideos()
  }, [query])

  return (
    <>
    <div className={styles.searchContainer}>
      <h2 className={styles.title}>Результаты по запросу: "{query}"</h2>
      
      {loading && <div>Загрузка...</div>}
      
      <div className={styles.grid}>
        {videos.map(item => {
          const enhancedItem = {
            id: item.id.videoId,
            snippet: {
              ...item.snippet,
              categoryId: 0  
            },
            statistics: { viewCount: '0' },
            contentDetails: { duration: 'PT0S' }
          }

          return (
            <GridCell 
              key={item.id.videoId}
              item={enhancedItem}  
            />
          )
        })}
      </div>
    </div>
    </>
  )
}