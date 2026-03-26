import styles from './Recommended.module.css'
import { useEffect, useState, memo } from 'react'
import { formatNumber } from '../../utils/formatNumber'
import { Link } from 'react-router-dom'
import { formatDuration } from '../../utils/formatDuration'
import { SaveButton } from '../SaveButton/SaveButton'
import { fetchPopularVideosByCategory } from '../../api/youtube'
import type { YouTubeVideo } from '../../types/youtube'

interface RecommendedProps {
  categoryId: string | undefined
}

const Recommended = ({ categoryId }: RecommendedProps) => {
  const [apiData, setApiData] = useState<YouTubeVideo[]>([])
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  useEffect(() => {
    if (!categoryId) return
    fetchPopularVideosByCategory(Number(categoryId))
      .then((items) => setApiData(items))
      .catch((error) => console.error('Ошибка загрузки рекомендаций:', error))
  }, [categoryId])

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleMenuClick = (e: React.MouseEvent, videoId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setOpenMenuId(openMenuId === videoId ? null : videoId)
  }

  return (
    <div className={styles.recommended}>
      {apiData.map((item) => {
        const videoId = item.id

        return (
          <div key={videoId} className={styles.side_video_list}>
            <Link
              to={`/video/${item.snippet.categoryId}/${item.id}`}
              className={styles.video_link}
              style={{ display: 'flex', gap: '10px', width: '100%' }}
            >
              <div className={styles.thumbnail_container}>
                <img src={item.snippet.thumbnails.medium?.url} alt="" />
                <div className={styles.duration}>
                  {formatDuration(item.contentDetails.duration)}
                </div>
              </div>

              <div className={styles.vid_info}>
                <h4>{item.snippet.title}</h4>
                <p>{item.snippet.channelTitle}</p>
                <p>{formatNumber(item.statistics.viewCount)} Views</p>
              </div>
            </Link>

            <button
              className={styles.menu_button}
              onClick={(e) => handleMenuClick(e, videoId)}
              aria-label="Меню видео"
            />

            {openMenuId === videoId && (
              <div className={styles.dropdown_menu}>
                <div className={styles.dropdown_item}>
                  <SaveButton videoId={videoId} />
                </div>
                <div className={styles.dropdown_item}>
                  <Link to={`/channel/${item.snippet.channelId}`}>
                    <span>Перейти на канал</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default memo(Recommended)
