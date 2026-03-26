import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './ShortsPlayer.module.css'
import { fetchShorts } from '../../api/youtube'
import type { YouTubeVideo } from '../../types/youtube'

interface ShortsPlayerProps {
  initialShorts: YouTubeVideo[]
  initialIndex: number
  onClose: () => void
}

const ShortsPlayer = ({ initialShorts, initialIndex, onClose }: ShortsPlayerProps) => {
  const [shorts, setShorts] = useState<YouTubeVideo[]>(initialShorts)
  const [index, setIndex] = useState(initialIndex)
  const [isLoading, setIsLoading] = useState(false)
  const nextTokenRef = useRef<string | null>(null)
  const isLoadingRef = useRef(false)
  const touchStartY = useRef<number | null>(null)

  const short = shorts[index]

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current) return
    isLoadingRef.current = true
    setIsLoading(true)
    try {
      const result = await fetchShorts(nextTokenRef.current ?? undefined)
      nextTokenRef.current = result.nextPageToken
      setShorts((prev) => {
        const existingIds = new Set(prev.map((s) => s.id))
        const fresh = result.items.filter((s) => !existingIds.has(s.id))
        return [...prev, ...fresh]
      })
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (index >= shorts.length - 3) loadMore()
  }, [index, shorts.length, loadMore])

  const goNext = useCallback(() => {
    setIndex((i) => i + 1)
  }, [])

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1))
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowUp') goPrev()
      if (e.key === 'ArrowDown') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, onClose])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return
    const delta = touchStartY.current - e.changedTouches[0].clientY
    if (delta > 50) goNext()
    else if (delta < -50) goPrev()
  }

  if (!short) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.container}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button className={styles.close} onClick={onClose}>
          ✕
        </button>

        <button className={styles.navBtn} onClick={goPrev} disabled={index === 0}>
          ↑
        </button>

        <div className={styles.player}>
          <iframe
            key={short.id}
            src={`https://www.youtube.com/embed/${short.id}?autoplay=1&rel=0&fs=0`}
            title={short.snippet.title}
            allow="autoplay"
            className={styles.iframe}
          />
          {isLoading && <div className={styles.loadingBadge}>Загрузка...</div>}
        </div>

        <button className={styles.navBtn} onClick={goNext}>
          ↓
        </button>

        <div className={styles.info}>
          <p className={styles.infoTitle}>{short.snippet.title}</p>
          <p className={styles.infoChannel}>{short.snippet.channelTitle}</p>
        </div>
      </div>
    </div>
  )
}

export default ShortsPlayer
