import './Feed.css'
import { useState, useEffect } from 'react'
import { Loader } from '../../UI/Loader/Loader'
import GridCell from './GridCell'
import ShortsRow from '../Shorts/ShortsRow'
import type { YouTubeVideo } from '../../types/youtube'

const ROWS_PER_SECTION = 7

const getColumnCount = (width: number): number => {
  if (width >= 2000) return 4
  if (width >= 1024) return 3
  if (width >= 768) return 2
  return 1
}

interface FeedProps {
  data: YouTubeVideo[]
  shorts?: YouTubeVideo[]
}

const Feed = ({ data, shorts = [] }: FeedProps) => {
  const [columnCount, setColumnCount] = useState(() => getColumnCount(window.innerWidth))

  useEffect(() => {
    const handleResize = () => setColumnCount(getColumnCount(window.innerWidth))
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!data || data.length === 0) {
    return <Loader />
  }

  const itemsPerSection = ROWS_PER_SECTION * columnCount
  const sections: YouTubeVideo[][] = []
  for (let i = 0; i < data.length; i += itemsPerSection) {
    sections.push(data.slice(i, i + itemsPerSection))
  }

  return (
    <div className="feed-container">
      {sections.map((section, idx) => (
        <div key={idx}>
          <div className="video-grid">
            {section.map((item) => (
              <GridCell key={item.id} item={item} />
            ))}
          </div>
          {shorts.length > 0 && <ShortsRow shorts={shorts} />}
        </div>
      ))}
    </div>
  )
}

export default Feed
