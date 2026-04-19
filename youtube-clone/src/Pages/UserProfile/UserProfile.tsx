import { useState, useEffect, useRef, useCallback, type ChangeEvent, type WheelEvent, type MouseEvent, type TouchEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { openAuthModal } from '../../redux/slices/uiSlice'
import { setCredentials } from '../../redux/slices/authSlice'
import { getHistory, clearHistory, type HistoryItem } from '../../utils/history'
import { getSavedVideos } from '../../api/saved'
import { fetchVideoDetailsBatch, fetchChannelsBatch } from '../../api/youtube'
import { getMySubscriptions } from '../../api/subscriptions'
import { getMyVideos, deleteUserVideo, type UserVideoRecord } from '../../api/userVideos'
import { formatDistanceToNow } from 'date-fns'
import { formatNumber } from '../../utils/formatNumber'
import styles from './UserProfile.module.css'
import type { YouTubeVideo, YouTubeChannel } from '../../types/youtube'
import { API_BASE_URL } from '../../api/config'
import { UploadVideo } from '../../Components/UploadVideo/UploadVideo'

type Tab = 'history' | 'saved' | 'subscriptions' | 'myvideos'

const CROP_SIZE = 260

export const UserProfile = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)

  const [tab, setTab] = useState<Tab>('history')
  const [history, setHistory] = useState<HistoryItem[]>(getHistory)
  const [savedVideos, setSavedVideos] = useState<YouTubeVideo[]>([])
  const [subscriptions, setSubscriptions] = useState<YouTubeChannel[]>([])
  const [loading, setLoading] = useState(false)
  const [myVideos, setMyVideos] = useState<UserVideoRecord[]>([])
  const [showUpload, setShowUpload] = useState(false)

  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 })
  const dragStart = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (tab === 'saved' && savedVideos.length === 0) {
      setLoading(true)
      getSavedVideos()
        .then(async (res) => {
          const ids = res.savedVideos.map((v) => v.videoId)
          if (ids.length) {
            const videos = await fetchVideoDetailsBatch(ids)
            setSavedVideos(videos)
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
    if (tab === 'subscriptions' && subscriptions.length === 0) {
      setLoading(true)
      getMySubscriptions()
        .then(async (subs) => {
          const ids = subs.map((s) => s.channelId)
          if (ids.length) {
            const channels = await fetchChannelsBatch(ids)
            setSubscriptions(channels)
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
    if (tab === 'myvideos') {
      setLoading(true)
      getMyVideos()
        .then((res) => { if (res.success) setMyVideos(res.videos) })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [tab])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const src = reader.result as string
      const img = new Image()
      img.onload = () => {
        const fitScale = Math.max(CROP_SIZE / img.width, CROP_SIZE / img.height)
        setImgSize({ w: img.width, h: img.height })
        setScale(fitScale)
        setOffset({ x: 0, y: 0 })
        setCropSrc(src)
      }
      img.src = src
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const clampOffset = useCallback((ox: number, oy: number, s: number) => {
    const hw = (imgSize.w * s) / 2
    const hh = (imgSize.h * s) / 2
    const half = CROP_SIZE / 2
    return {
      x: Math.min(hw - half, Math.max(-(hw - half), ox)),
      y: Math.min(hh - half, Math.max(-(hh - half), oy)),
    }
  }, [imgSize])

  const onMouseDown = (e: MouseEvent) => {
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y }
  }
  const onMouseMove = (e: MouseEvent) => {
    if (!dragStart.current) return
    const dx = e.clientX - dragStart.current.mx
    const dy = e.clientY - dragStart.current.my
    setOffset(clampOffset(dragStart.current.ox + dx, dragStart.current.oy + dy, scale))
  }
  const onMouseUp = () => { dragStart.current = null }
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0]
    dragStart.current = { mx: t.clientX, my: t.clientY, ox: offset.x, oy: offset.y }
  }
  const onTouchMove = (e: TouchEvent) => {
    if (!dragStart.current) return
    const t = e.touches[0]
    const dx = t.clientX - dragStart.current.mx
    const dy = t.clientY - dragStart.current.my
    setOffset(clampOffset(dragStart.current.ox + dx, dragStart.current.oy + dy, scale))
  }
  const onWheel = (e: WheelEvent) => {
    e.preventDefault()
    const minScale = Math.max(CROP_SIZE / imgSize.w, CROP_SIZE / imgSize.h)
    const newScale = Math.min(5, Math.max(minScale, scale - e.deltaY * 0.002))
    setScale(newScale)
    setOffset(clampOffset(offset.x, offset.y, newScale))
  }

  const confirmCrop = () => {
    if (!cropSrc || !user || !token) return
    const canvas = document.createElement('canvas')
    canvas.width = CROP_SIZE
    canvas.height = CROP_SIZE
    const ctx = canvas.getContext('2d')!
    ctx.beginPath()
    ctx.arc(CROP_SIZE / 2, CROP_SIZE / 2, CROP_SIZE / 2, 0, Math.PI * 2)
    ctx.clip()
    const img = new Image()
    img.onload = async () => {
      const w = imgSize.w * scale
      const h = imgSize.h * scale
      const x = CROP_SIZE / 2 - w / 2 + offset.x
      const y = CROP_SIZE / 2 - h / 2 + offset.y
      ctx.drawImage(img, x, y, w, h)
      const newAvatar = canvas.toDataURL('image/jpeg', 0.85)
      setCropSrc(null)

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar: newAvatar }),
        })
        const data = await res.json()
        if (res.ok && data.user) {
          const updatedUser = { ...user, avatar: newAvatar }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          dispatch(setCredentials({ user: updatedUser, token }))
        }
      } catch (err) {
        console.error('Avatar update failed', err)
      }
    }
    img.src = cropSrc
  }

  if (!user) {
    return (
      <div className={styles.guest}>
        <div className={styles.guestIcon}>
          <svg viewBox="0 0 24 24" width="80" height="80" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <h2>Войдите в аккаунт</h2>
        <p>Чтобы видеть историю, сохранённые видео и подписки</p>
        <button className={styles.loginBtn} onClick={() => dispatch(openAuthModal('login'))}>
          Войти
        </button>
      </div>
    )
  }

  return (
    <>
      {cropSrc && (
        <div className={styles.cropOverlay}>
          <div className={styles.cropModal}>
            <p className={styles.cropHint}>Перемещай фото, скролл — зум</p>
            <div
              className={styles.cropCircle}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onMouseUp}
              onWheel={onWheel}
            >
              <img
                src={cropSrc}
                alt=""
                className={styles.cropImg}
                style={{
                  width: imgSize.w * scale,
                  height: imgSize.h * scale,
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                }}
                draggable={false}
              />
            </div>
            <div className={styles.cropActions}>
              <button type="button" className={styles.cropCancel} onClick={() => setCropSrc(null)}>Отмена</button>
              <button type="button" className={styles.cropConfirm} onClick={confirmCrop}>Готово</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarWrapper} onClick={() => fileInputRef.current?.click()}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className={styles.avatarImg} />
            ) : (
              <div className={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
            )}
            <div className={styles.avatarOverlay}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                <path d="M12 15.2A3.2 3.2 0 0 1 8.8 12 3.2 3.2 0 0 1 12 8.8 3.2 3.2 0 0 1 15.2 12 3.2 3.2 0 0 1 12 15.2M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z"/>
              </svg>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
          </div>
          <div>
            <h1 className={styles.name}>{user.name}</h1>
            <p className={styles.email}>{user.email}</p>
            <p className={styles.changePhotoHint}>Нажми на фото чтобы изменить</p>
          </div>
        </div>

        <div className={styles.tabs}>
          {(['history', 'saved', 'subscriptions', 'myvideos'] as Tab[]).map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
              onClick={() => { setTab(t); setShowUpload(false) }}
            >
              {t === 'history' && 'История'}
              {t === 'saved' && 'Сохранённые'}
              {t === 'subscriptions' && 'Подписки'}
              {t === 'myvideos' && 'Мои видео'}
            </button>
          ))}
        </div>

        {tab === 'history' && (
          <div>
            {history.length === 0 ? (
              <p className={styles.empty}>История пуста</p>
            ) : (
              <>
                <button className={styles.clearBtn} onClick={() => { clearHistory(); setHistory([]) }}>
                  Очистить историю
                </button>
                <div className={styles.historyList}>
                  {history.map((item) => (
                    <Link key={`${item.id}-${item.watchedAt}`} to={`/video/${item.categoryId}/${item.id}`} className={styles.historyItem}>
                      <img src={item.thumbnail} alt={item.title} className={styles.historyThumb} />
                      <div className={styles.historyInfo}>
                        <p className={styles.historyTitle}>{item.title}</p>
                        <p className={styles.historyChannel}>{item.channelTitle}</p>
                        <p className={styles.historyTime}>
                          {formatDistanceToNow(new Date(item.watchedAt), { addSuffix: true })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'saved' && (
          <div>
            {loading ? (
              <p className={styles.empty}>Загрузка...</p>
            ) : savedVideos.length === 0 ? (
              <p className={styles.empty}>Нет сохранённых видео</p>
            ) : (
              <div className={styles.videoGrid}>
                {savedVideos.map((video) => (
                  <Link key={video.id} to={`/video/${video.snippet.categoryId}/${video.id}`} className={styles.videoCard}>
                    <div className={styles.videoThumb}>
                      <img src={video.snippet.thumbnails.medium?.url} alt={video.snippet.title} />
                    </div>
                    <p className={styles.videoTitle}>{video.snippet.title}</p>
                    <p className={styles.videoChannel}>{video.snippet.channelTitle}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'subscriptions' && (
          <div>
            {loading ? (
              <p className={styles.empty}>Загрузка...</p>
            ) : subscriptions.length === 0 ? (
              <p className={styles.empty}>Нет подписок</p>
            ) : (
              <div className={styles.channelList}>
                {subscriptions.map((ch) => (
                  <Link key={ch.id} to={`/channel/${ch.id}`} className={styles.channelItem}>
                    <img src={ch.snippet.thumbnails.default?.url} alt={ch.snippet.title} className={styles.channelAvatar} />
                    <div>
                      <p className={styles.channelName}>{ch.snippet.title}</p>
                      <p className={styles.channelSubs}>
                        {Number(ch.statistics?.subscriberCount || 0).toLocaleString()} подписчиков
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'myvideos' && (
          <div>
            {showUpload ? (
              <UploadVideo
                onSuccess={() => {
                  setShowUpload(false)
                  setLoading(true)
                  getMyVideos()
                    .then((res) => { if (res.success) setMyVideos(res.videos) })
                    .catch(console.error)
                    .finally(() => setLoading(false))
                }}
                onCancel={() => setShowUpload(false)}
              />
            ) : (
              <>
                <div className={styles.myVideosHeader}>
                  <button className={styles.uploadBtn} onClick={() => setShowUpload(true)}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
                    </svg>
                    Загрузить видео
                  </button>
                </div>

                {loading ? (
                  <p className={styles.empty}>Загрузка...</p>
                ) : myVideos.length === 0 ? (
                  <div className={styles.uploadPrompt}>
                    <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor" style={{ opacity: 0.3 }}>
                      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                    </svg>
                    <p>У вас пока нет видео</p>
                    <span>Нажмите «Загрузить видео» чтобы поделиться своим контентом</span>
                  </div>
                ) : (
                  <div className={styles.videoGrid}>
                    {myVideos.map((v) => (
                      <div key={v.id} className={styles.myVideoCard}>
                        <Link to={`/user-video/${v.id}`}>
                          <div className={styles.myVideoThumb}>
                            {v.thumbnailUrl ? (
                              <img src={v.thumbnailUrl} alt={v.title} />
                            ) : (
                              <div className={styles.noThumb}>▶</div>
                            )}
                          </div>
                          <p className={styles.videoTitle}>{v.title}</p>
                          <p className={styles.videoChannel}>{formatNumber(v.viewCount)} просмотров</p>
                        </Link>
                        <button
                          className={styles.deleteVideoBtn}
                          onClick={async () => {
                            if (!confirm('Удалить видео?')) return
                            await deleteUserVideo(v.id)
                            setMyVideos((prev) => prev.filter((x) => x.id !== v.id))
                          }}
                          title="Удалить"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}
