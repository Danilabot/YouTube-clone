import { useState } from 'react'
import { Myinput } from '../../../UI/input/Myinput'
import styles from './Registration.module.css'
import icon_hidden from '../../../assets/icon_hidden.png'
import icon_eye from '../../../assets/icon_eye.png'
function Register({ setAuthMode }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function validateForm() {
    if (!name.trim()) {
      setError('Имя обязательно')
      return false
    }
    if (!email.includes('@')) {
      setError('Введите корректный email')
      return false
    }
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      return false
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return false
    }
    return true
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    
    if (!validateForm()) return

    setLoading(true)

    fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        confirmPassword: password
      }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Ошибка регистрации')
        }
        return data
      })
      .then((data) => {
        console.log(data)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        window.location.reload()
      })
      .catch((error) => {
        console.log('полная ошибка:', error)
        setError(error.message)
      })
      .finally(() => setLoading(false))
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
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <img src={icon_hidden}/> : <img src={icon_eye}/>}
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
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <img src={icon_hidden}/> : <img src={icon_eye}/>}
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>

      <p className={styles.footerText}>
        Уже есть аккаунт?{' '}
        <span 
          className={styles.link}
          onClick={() => setAuthMode('login')}
        >
          Войти
        </span>
      </p>
    </form>
  )
}

export default Register