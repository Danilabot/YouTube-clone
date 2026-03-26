import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import GridCell from '../../Components/Feed/GridCell'
import styles from './SearchResults.module.css'
import { searchVideos } from '../../api/youtube'
import type { YouTubeSearchResult, YouTubeVideo } from '../../types/youtube'

interface SearchResultsProps {
  sidebar: boolean
  setCategory: (category: number) => void
  category: number
}

// Адаптирует YouTubeSearchResult (из /search) к формату YouTubeVideo для GridCell
const adaptSearchResult = (item: YouTubeSearchResult): YouTubeVideo => ({
  kind: 'youtube#video',
  etag: item.etag,
  id: item.id.videoId ?? '',
  snippet: {
    ...item.snippet,
    categoryId: '0',
    tags: [],
  },
  statistics: { viewCount: '0' },
  contentDetails: { duration: 'PT0S' },
})

export const SearchResults = ({ sidebar: _sidebar, setCategory: _setCategory, category: _category }: SearchResultsProps) => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [videos, setVideos] = useState<YouTubeSearchResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) return
    setLoading(true)

    searchVideos(query)
      .then((items) => setVideos(items))
      .catch((error) => console.error('Ошибка поиска:', error))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className={styles.searchContainer}>
      <h2 className={styles.title}>Результаты по запросу: "{query}"</h2>

      {loading && <div>Загрузка...</div>}

      <div className={styles.grid}>
        {videos.map((item) => (
          <GridCell key={item.id.videoId} item={adaptSearchResult(item)} />
        ))}
      </div>
    </div>
  )
}
