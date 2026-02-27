import './Feed.css'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { formatDuration } from '../../utils/formatDuration'
import { value_converter } from '../../utils/data'
import { useState, useEffect } from 'react'
import { API_KEY } from '../../utils/data'

const GridCell = memo(({ item, style, columnGap, rowGap }) => {
  const [channelLogo, setChannelLogo] = useState(null)

  useEffect(() => {
    if (!item) return

    const fetchLogo = async () => {
      try {
        const channelId = item.snippet.channelId
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`,
        )
        const data = await res.json()
        if (data.items && data.items.length > 0) {
          setChannelLogo(data.items[0].snippet.thumbnails.default.url)
        }
      } catch (err) {
        console.error('Error loading channel logo', err)
      }
    }

    fetchLogo()
  }, [item])

  if (!item) return null
  return (
    <div
      style={{
        ...style,
        paddingLeft: columnGap / 2,
        paddingRight: columnGap / 2,
        paddingTop: rowGap / 2,
        paddingBottom: rowGap / 2,
        boxSizing: 'border-box',
      }}
      className="card"
    >
      <Link to={`video/${item.snippet.categoryId}/${item.id}`}>
        <div className="thumbnail-wrapper">
          <img
            src={item.snippet.thumbnails.medium.url}
            alt={item.snippet.title}
          />
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
          <img
            src={channelLogo}
            alt={item.snippet.channelTitle}
            className="logo"
          />

          <div className="video-text">
            <h2>{item.snippet.title}</h2>
            <h3>{item.snippet.channelTitle}</h3>
            <p>
              {value_converter(item.statistics.viewCount)} views &bull;{' '}
              {formatDistanceToNow(new Date(item.snippet.publishedAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
})

GridCell.displayName = 'GridCell'

export default GridCell
