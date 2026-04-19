import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getUserVideoById, type UserVideoRecord } from '../../api/userVideos'
import { formatNumber } from '../../utils/formatNumber'
import { formatDistanceToNow } from 'date-fns'
import styles from './UserVideoPage.module.css'

const UserVideoPage = () => {
  const { id } = useParams<{ id: string }>()
  const [video, setVideo] = useState<UserVideoRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getUserVideoById(id)
      .then((res) => {
        if (res.success) setVideo(res.video)
        else setError(true)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeletonVideo} />
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonMeta} />
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className={styles.error}>
        <h2>Видео не найдено</h2>
        <Link to="/" className={styles.backLink}>← На главную</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.playerWrap}>
        <video
          src={video.videoUrl}
          controls
          autoPlay
          className={styles.player}
          poster={video.thumbnailUrl ?? undefined}
        />
      </div>

      <div className={styles.meta}>
        <h1 className={styles.title}>{video.title}</h1>

        <div className={styles.info}>
          <div className={styles.author}>
            {video.author?.avatar ? (
              <img src={video.author.avatar} className={styles.avatar} alt={video.author.name} />
            ) : (
              <div className={styles.avatarFallback}>
                {video.author?.name?.charAt(0).toUpperCase() ?? '?'}
              </div>
            )}
            <span className={styles.authorName}>{video.author?.name ?? 'Пользователь'}</span>
          </div>

          <div className={styles.stats}>
            <span>{formatNumber(video.viewCount)} просмотров</span>
            <span>·</span>
            <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        {video.description && (
          <div className={styles.description}>
            <p>{video.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserVideoPage
