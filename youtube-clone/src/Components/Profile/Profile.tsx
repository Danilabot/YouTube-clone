import { useEffect, useRef, useCallback, useState, type ChangeEvent, type WheelEvent, type MouseEvent, type TouchEvent } from 'react'
import './Profile.css'
import { logout, setCredentials } from '../../redux/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { toggleTheme } from '../../redux/slices/themeSlice'
import { closeProfileMenu, openAuthModal } from '../../redux/slices/uiSlice'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../../api/config'

const CROP_SIZE = 260

export const Profile = () => {
  const dispatch = useAppDispatch()
  const isDark = useAppSelector((state) => state.theme.isDark)
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)
  const isProfileMenuOpen = useAppSelector((state) => state.ui.isProfileMenuOpen)

  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 })
  const dragStart = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch(closeProfileMenu())
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch(closeProfileMenu())
    }
    if (isProfileMenuOpen) {
      document.addEventListener('keydown', handleEsc)
    }
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isProfileMenuOpen, dispatch])

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
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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

  return (
    <>
      {cropSrc && (
        <div className="crop_overlay">
          <div className="crop_modal">
            <p className="crop_hint">Перемещай фото, скролл — зум</p>
            <div
              className="crop_circle"
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
                className="crop_img"
                style={{
                  width: imgSize.w * scale,
                  height: imgSize.h * scale,
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                }}
                draggable={false}
              />
            </div>
            <div className="crop_actions">
              <button type="button" className="crop_cancel" onClick={() => setCropSrc(null)}>Отмена</button>
              <button type="button" className="crop_confirm" onClick={confirmCrop}>Готово</button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`menu-backdrop ${isProfileMenuOpen ? 'active' : ''}`}
        onClick={() => dispatch(closeProfileMenu())}
      />

      <nav className={`menu ${isProfileMenuOpen ? 'active' : ''}`}>
        {user && (
          <div className="menu_user">
            <div className="menu_user_avatar_wrap" onClick={() => { fileInputRef.current?.click(); dispatch(closeProfileMenu()) }}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="menu_user_avatar" />
              ) : (
                <div className="menu_user_avatar_placeholder">{user.name.charAt(0).toUpperCase()}</div>
              )}
              <div className="menu_user_avatar_edit">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
                  <path d="M12 15.2A3.2 3.2 0 0 1 8.8 12 3.2 3.2 0 0 1 12 8.8 3.2 3.2 0 0 1 15.2 12 3.2 3.2 0 0 1 12 15.2M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z"/>
                </svg>
              </div>
            </div>
            <div>
              <div className="menu_user_name">{user.name}</div>
              <div className="menu_user_email">{user.email}</div>
            </div>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

        <ul className="menu_list">
          <li className="menu_item" onClick={() => dispatch(openAuthModal('login'))}>
            <span>Вход</span>
          </li>
          <li className="menu_item" onClick={() => dispatch(openAuthModal('register'))}>
            <span>Регистрация</span>
          </li>
          <li className="menu_item">
            <Link to="/saved">
              <span>Сохраненные видео</span>
            </Link>
          </li>

          <div className="menu_divider" />

          <li className="menu_item">
            <div className="theme_toggle">
              <span>Тёмная тема</span>
              <button onClick={() => dispatch(toggleTheme())}>
                {isDark ? 'Вкл' : 'Выкл'}
              </button>
            </div>
          </li>

          <div className="menu_divider" />

          <li className="menu_item logout" onClick={handleLogout}>
            <span>Выйти</span>
          </li>
        </ul>
      </nav>
    </>
  )
}
