import { useState, useEffect, useRef, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchShorts } from '../../api/youtube'
import { formatNumber } from '../../utils/formatNumber'
import styles from './ShortsPage.module.css'
import type { YouTubeVideo } from '../../types/youtube'

const ShortsPage = () => {
  const [index, setIndex] = useState(0)
  const [shorts, setShorts] = useState<YouTubeVideo[]>([])
  const nextTokenRef = useRef<string | null>(null)
  const isLoadingRef = useRef(false)
  const touchStartY = useRef<number | null>(null)

  const { data: initial } = useQuery({
    queryKey: ['shorts'],
    queryFn: () => fetchShorts(),
    staleTime: 10 * 60 * 1000,
  })

  useEffect(() => {
    if (initial?.items?.length) {
      setShorts(initial.items)
      nextTokenRef.current = initial.nextPageToken
    }
  }, [initial])

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current) return
    isLoadingRef.current = true
    try {
      const result = await fetchShorts(nextTokenRef.current ?? undefined)
      nextTokenRef.current = result.nextPageToken
      setShorts((prev) => {
        const ids = new Set(prev.map((s) => s.id))
        return [...prev, ...result.items.filter((s) => !ids.has(s.id))]
      })
    } finally {
      isLoadingRef.current = false
    }
  }, [])

  useEffect(() => {
    if (index >= shorts.length - 3) loadMore()
  }, [index, shorts.length, loadMore])

  const goNext = useCallback(() => setIndex((i) => i + 1), [])
  const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') goPrev()
      if (e.key === 'ArrowDown') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return
    const delta = touchStartY.current - e.changedTouches[0].clientY
    if (delta > 50) goNext()
    else if (delta < -50) goPrev()
  }

  const short = shorts[index]

  if (!shorts.length) {
    return <div className={styles.loading}>Загрузка шортсов...</div>
  }

  return (
    <div
      className={styles.page}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.player}>
        {short && (
          <iframe
            key={short.id}
            src={`https://www.youtube.com/embed/${short.id}?autoplay=1&rel=0&fs=0`}
            title={short.snippet.title}
            allow="autoplay"
            className={styles.iframe}
          />
        )}

        {/* Кнопки навигации (ПК) */}
        <div className={styles.navButtons}>
          <button className={styles.navBtn} onClick={goPrev} disabled={index === 0}>↑</button>
          <button className={styles.navBtn} onClick={goNext}>↓</button>
        </div>

        {/* Инфо о видео поверх плеера */}
        {short && (
          <div className={styles.info}>
            <p className={styles.infoTitle}>{short.snippet.title}</p>
            <p className={styles.infoChannel}>
              {short.snippet.channelTitle} · {formatNumber(short.statistics?.viewCount)} просмотров
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShortsPage
