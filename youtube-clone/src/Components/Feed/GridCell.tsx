import './Feed.css'
import { memo, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { formatDuration } from '../../utils/formatDuration'
import { formatNumber } from '../../utils/formatNumber'
import { getProgress } from '../../utils/watchProgress'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchChannelLogo } from '../../redux/slices/channelsSlice'
import type { YouTubeVideo } from '../../types/youtube'

interface GridCellProps {
  item: YouTubeVideo
}

const GridCell = memo(({ item }: GridCellProps) => {
  const dispatch = useAppDispatch()
  const channelId = item.snippet.channelId
  const channelLogo = useAppSelector((state) => state.channels.logos[channelId] ?? null)
  const thumbnailUrl = item.snippet.thumbnails.medium?.url
  const [ready, setReady] = useState(false)
  const [progress] = useState(() => getProgress(item.id))
  const [hovered, setHovered] = useState(false)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    dispatch(fetchChannelLogo(channelId))
  }, [channelId, dispatch])

  useEffect(() => {
    if (!thumbnailUrl) return
    const img = new Image()
    img.onload = () => setReady(true)
    img.src = thumbnailUrl
  }, [thumbnailUrl])

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => setHovered(true), 700)
  }

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setHovered(false)
  }

  if (!ready || !thumbnailUrl) return null

  return (
    <div className="card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link to={`/video/${item.snippet.categoryId}/${item.id}`}>
        <div className="thumbnail-wrapper">
          <img
            src={thumbnailUrl}
            alt={item.snippet.title}
            style={{ opacity: hovered ? 0 : 1, transition: 'opacity 0.2s' }}
          />
          {hovered && (
            <iframe
              className="hover-preview"
              src={`https://www.youtube.com/embed/${item.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${item.id}&rel=0&iv_load_policy=3&modestbranding=1`}
              allow="autoplay"
              title={item.snippet.title}
            />
          )}
          <div className="duration-badge">
            {formatDuration(item.contentDetails.duration)}
          </div>
          {progress > 0 && (
            <div className="progress-bar-bg">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
        <div className="video-info">
          <Link to={`/channel/${channelId}`}>
            <img src={channelLogo ?? undefined} alt={item.snippet.channelTitle} className="logo" />
          </Link>
          <div className="video-text">
            <h2>{item.snippet.title}</h2>
            <h3>{item.snippet.channelTitle}</h3>
            <p>
              {formatNumber(item.statistics.viewCount)} views &bull;{' '}
              {formatDistanceToNow(new Date(item.snippet.publishedAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
})

GridCell.displayName = 'GridCell'
export default GridCell
