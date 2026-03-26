import { useState, type FormEvent } from 'react'
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

function Register({ onSuccess }: RegisterProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const dispatch = useAppDispatch()
  const authError = useAppSelector((state) => state.auth.error)
  const loading = useAppSelector((state) => state.auth.loading)

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
        body: JSON.stringify({ name, email, password, confirmPassword: password }),
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
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      <h2 className={styles.title}>Создать аккаунт</h2>

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
  )
}

export default Register
