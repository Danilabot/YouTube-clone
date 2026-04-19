import './Feed.css'
import { memo, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { formatDuration } from '../../utils/formatDuration'
import { formatNumber } from '../../utils/formatNumber'
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
  const [imageLoaded, setImageLoaded] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    dispatch(fetchChannelLogo(channelId))
  }, [channelId, dispatch])

  if (hidden || !thumbnailUrl) return null

  return (
    <div className="card" style={{ opacity: imageLoaded ? 1 : 0 }}>
      <Link to={`/video/${item.snippet.categoryId}/${item.id}`}>
        <div className="thumbnail-wrapper">
          <img src={thumbnailUrl} alt={item.snippet.title} onLoad={() => setImageLoaded(true)} onError={() => setHidden(true)} />
          <div
            className="duration"
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '25px',
              background: 'rgba(27, 26, 26, 0.64)',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '7px',
              fontSize: '12px',
            }}
          >
            {formatDuration(item.contentDetails.duration)}
          </div>
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
