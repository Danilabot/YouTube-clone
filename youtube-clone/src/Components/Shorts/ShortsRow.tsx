import { useState } from 'react'
import styles from './ShortsRow.module.css'
import ShortsPlayer from './ShortsPlayer'
import { formatNumber } from '../../utils/formatNumber'
import { formatDuration } from '../../utils/formatDuration'
import type { YouTubeVideo } from '../../types/youtube'

interface ShortsRowProps {
  shorts: YouTubeVideo[]
}

const ShortsRow = ({ shorts }: ShortsRowProps) => {
  const [playerIndex, setPlayerIndex] = useState<number | null>(null)
  const visible = shorts.slice(0, 5)

  if (!visible.length) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
          <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.77 2.71-2.89 1.94-4.73-.77-1.84-2.89-2.71-4.73-1.94L6 5.8C4.16 6.57 3.29 8.69 4.06 10.53c.57 1.36 1.92 2.17 3.31 2.16l-1.2.5C4.33 13.96 3.46 16.08 4.23 17.92c.77 1.84 2.89 2.71 4.73 1.94l8.21-3.41c1.84-.77 2.71-2.89 1.94-4.73-.57-1.36-1.92-2.17-3.34-2.4zM10 14.65V9.35L15 12l-5 2.65z" />
        </svg>
        <span>Shorts</span>
      </div>

      <div className={styles.grid}>
        {visible.map((short, idx) => (
          <div key={short.id} className={styles.card} onClick={() => setPlayerIndex(idx)}>
            <div className={styles.thumbnail}>
              <img src={short.snippet.thumbnails.medium?.url} alt={short.snippet.title} />
              <span className={styles.duration}>
                {formatDuration(short.contentDetails?.duration)}
              </span>
            </div>
            <p className={styles.title}>{short.snippet.title}</p>
            <p className={styles.views}>{formatNumber(short.statistics?.viewCount)} views</p>
          </div>
        ))}
      </div>

      {playerIndex !== null && (
        <ShortsPlayer
          initialShorts={shorts}
          initialIndex={playerIndex}
          onClose={() => setPlayerIndex(null)}
        />
      )}
    </div>
  )
}

export default ShortsRow
