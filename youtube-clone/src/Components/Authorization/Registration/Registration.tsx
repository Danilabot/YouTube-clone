import { useState, useRef, useCallback, type FormEvent, type ChangeEvent, type WheelEvent, type MouseEvent, type TouchEvent } from 'react'
import { Myinput } from '../../../UI/input/Myinput'
import styles from './Registration.module.css'
import icon_hidden from '../../../assets/icon_hidden.png'
import icon_eye from '../../../assets/icon_eye.png'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { setCredentials, setLoading, setError } from '../../../redux/slices/authSlice'
import { API_BASE_URL } from '../../../api/config'
import { openAuthModal } from '../../../redux/slices/uiSlice'
import type { AuthUser } from '../../../redux/slices/authSlice'

interface RegisterProps {
  onSuccess?: () => void
}

interface RegisterResponse {
  token: string
  user: AuthUser
  error?: string
  errors?: Record<string, string>
}

const CROP_SIZE = 260

function Register({ onSuccess }: RegisterProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 })
  const dragStart = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()
  const authError = useAppSelector((state) => state.auth.error)
  const loading = useAppSelector((state) => state.auth.loading)

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      dispatch(setError('Фото не должно превышать 5MB'))
      return
    }
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
    if (!cropSrc) return
    const canvas = document.createElement('canvas')
    canvas.width = CROP_SIZE
    canvas.height = CROP_SIZE
    const ctx = canvas.getContext('2d')!
    ctx.beginPath()
    ctx.arc(CROP_SIZE / 2, CROP_SIZE / 2, CROP_SIZE / 2, 0, Math.PI * 2)
    ctx.clip()
    const img = new Image()
    img.onload = () => {
      const w = imgSize.w * scale
      const h = imgSize.h * scale
      const x = CROP_SIZE / 2 - w / 2 + offset.x
      const y = CROP_SIZE / 2 - h / 2 + offset.y
      ctx.drawImage(img, x, y, w, h)
      setAvatar(canvas.toDataURL('image/jpeg', 0.85))
      setCropSrc(null)
    }
    img.src = cropSrc
  }

  const validateForm = (): string | null => {
    if (!name.trim()) return 'Имя обязательно'
    if (!email.includes('@')) return 'Введите корректный email'
    if (password.length < 6) return 'Пароль должен быть не менее 6 символов'
    if (password !== confirmPassword) return 'Пароли не совпадают'
    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(setLoading(true))

    const errorMsg = validateForm()
    if (errorMsg) {
      dispatch(setError(errorMsg))
      dispatch(setLoading(false))
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword: password, avatar }),
      })
      const data: RegisterResponse = await res.json()

      if (!res.ok) {
        const msg =
          data.error ??
          (data.errors ? Object.values(data.errors)[0] : undefined) ??
          'Ошибка регистрации'
        throw new Error(msg)
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      dispatch(setCredentials({ user: data.user, token: data.token }))
      onSuccess?.()
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Ошибка регистрации'))
    } finally {
      dispatch(setLoading(false))
    }
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

      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <h2 className={styles.title}>Создать аккаунт</h2>

        <div className={styles.avatarSection}>
          <div className={styles.avatarPreview} onClick={() => fileInputRef.current?.click()}>
            {avatar ? (
              <img src={avatar} alt="Аватар" className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <span className={styles.avatarIcon}>+</span>
                <span className={styles.avatarHint}>Фото</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className={styles.fileInput}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Имя</label>
          <Myinput
            type="text"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <Myinput
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Пароль</label>
          <div className={styles.passwordWrapper}>
            <Myinput
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <img src={showPassword ? icon_hidden : icon_eye} alt="" />
            </button>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Подтвердите пароль</label>
          <div className={styles.passwordWrapper}>
            <Myinput
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              required
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              <img src={showConfirmPassword ? icon_hidden : icon_eye} alt="" />
            </button>
          </div>
        </div>

        {authError && <div className={styles.error}>{authError}</div>}

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <p className={styles.footerText}>
          Уже есть аккаунт?{' '}
          <span className={styles.link} onClick={() => dispatch(openAuthModal('login'))}>
            Войти
          </span>
        </p>
      </form>
    </>
  )
}

export default Register
