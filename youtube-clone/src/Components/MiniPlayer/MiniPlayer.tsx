import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { closeMiniPlayer, hideMiniPlayer } from '../../redux/slices/miniPlayerSlice'
import styles from './MiniPlayer.module.css'

const ExpandIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
)

export const MiniPlayer = () => {
  const { visible, videoId, categoryId, title, channelTitle } = useAppSelector(s => s.miniPlayer)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  if (!visible || !videoId) return null

  const handleExpand = () => {
    dispatch(hideMiniPlayer())
    navigate(`/video/${categoryId}/${videoId}`)
  }

  return (
    <div className={styles.wrap}>
      <iframe
        className={styles.iframe}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <div className={styles.bar}>
        <div className={styles.info} onClick={handleExpand}>
          <p className={styles.title}>{title}</p>
          <p className={styles.channel}>{channelTitle}</p>
        </div>
        <button className={styles.btn} onClick={handleExpand} title="Развернуть">
          <ExpandIcon />
        </button>
        <button className={styles.btn} onClick={() => dispatch(closeMiniPlayer())} title="Закрыть">
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}
