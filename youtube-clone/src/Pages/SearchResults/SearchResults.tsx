import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import styles from './SearchResults.module.css'
import { searchVideos, fetchVideoDetailsBatch } from '../../api/youtube'
import { formatNumber } from '../../utils/formatNumber'
import { formatDuration } from '../../utils/formatDuration'
import { formatDistanceToNow } from 'date-fns'
import type { YouTubeVideo } from '../../types/youtube'

export const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    setVideos([])

    searchVideos(query)
      .then((items) => {
        const ids = items.map((i) => i.id.videoId).filter(Boolean) as string[]
        return fetchVideoDetailsBatch(ids)
      })
      .then((details) => setVideos(details))
      .catch((err) => console.error('Ошибка поиска:', err))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Результаты по запросу: «{query}»</h2>

      {loading && (
        <div className={styles.skeletons}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className={styles.skeleton}>
              <div className={styles.skeletonThumb} />
              <div className={styles.skeletonInfo}>
                <div className={styles.skeletonLine} style={{ width: '80%', height: 18 }} />
                <div className={styles.skeletonLine} style={{ width: '40%', height: 14 }} />
                <div className={styles.skeletonLine} style={{ width: '60%', height: 14 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && videos.length === 0 && query && (
        <div className={styles.empty}>
          <p>По запросу «{query}» ничего не найдено</p>
          <span>Попробуйте другие ключевые слова</span>
        </div>
      )}

      {!loading && videos.length > 0 && (
        <div className={styles.list}>
          {videos.map((video) => (
            <Link
              key={video.id}
              to={`/video/${video.snippet.categoryId || 0}/${video.id}`}
              className={styles.item}
            >
              <div className={styles.thumb}>
                <img src={video.snippet.thumbnails.medium?.url} alt={video.snippet.title} />
                <span className={styles.duration}>
                  {formatDuration(video.contentDetails.duration)}
                </span>
              </div>
              <div className={styles.info}>
                <h3 className={styles.videoTitle}>{video.snippet.title}</h3>
                <p className={styles.meta}>
                  {formatNumber(video.statistics.viewCount)} просмотров &bull;{' '}
                  {formatDistanceToNow(new Date(video.snippet.publishedAt), { addSuffix: true })}
                </p>
                <p className={styles.channel}>{video.snippet.channelTitle}</p>
                <p className={styles.desc}>
                  {video.snippet.description?.slice(0, 120)}
                  {(video.snippet.description?.length ?? 0) > 120 && '...'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
