import { useState, type FormEvent } from 'react'
import { Myinput } from '../../../UI/input/Myinput'
import styles from './Login.module.css'
import icon_hidden from '../../../assets/icon_hidden.png'
import icon_eye from '../../../assets/icon_eye.png'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { setCredentials, setLoading, setError } from '../../../redux/slices/authSlice'
import { API_BASE_URL } from '../../../api/config'
import { openAuthModal } from '../../../redux/slices/uiSlice'
import type { AuthUser } from '../../../redux/slices/authSlice'

interface LoginProps {
  onSuccess?: () => void
}

interface LoginResponse {
  token: string
  user: AuthUser
  error?: string
}

export const Login = ({ onSuccess }: LoginProps) => {
  const dispatch = useAppDispatch()
  const authError = useAppSelector((state) => state.auth.error)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(setLoading(true))

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data: LoginResponse = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Ошибка входа')
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      dispatch(setCredentials({ user: data.user, token: data.token }))
      onSuccess?.()
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Ошибка входа'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <form onSubmit={submit} className={styles.loginForm}>
      <h2 className={styles.title}>Добро пожаловать!</h2>
      <p className={styles.subtitle}>Войдите в свой аккаунт</p>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Email</label>
        <Myinput
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
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
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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

      {authError && <div className={styles.error}>{authError}</div>}

      <button type="submit" className={styles.submitButton}>
        Войти
      </button>

      <p className={styles.footerText}>
        Нет аккаунта?{' '}
        <span className={styles.link} onClick={() => dispatch(openAuthModal('register'))}>
          Зарегистрироваться
        </span>
      </p>
    </form>
  )
}
