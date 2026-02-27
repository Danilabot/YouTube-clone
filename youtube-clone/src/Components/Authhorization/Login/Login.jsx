// import { useContext, useState } from 'react'
// import { Myinput } from '../../../UI/input/Myinput'
// import { AuthContext } from '../../../context/context'
// export const Login = ({ onSuccess, setAuthMode }) => {
//   const { login, error } = useContext(AuthContext)
//   const [form, setForm] = useState({ email: '', password: '' })

//   const submit = async (e) => {
//     e.preventDefault()
//     const success = await login(form.email, form.password)
//     if (success) onSuccess?.()
//   }

//   return (
//     <form onSubmit={submit}>
//       <h2>Вход</h2>

//       <Myinput
//         type="email"
//         placeholder="Email"
//         value={form.email}
//         onChange={(e) => setForm({ ...form, email: e.target.value })}
//       />

//       <Myinput
//         type="password"
//         placeholder="Пароль"
//         value={form.password}
//         onChange={(e) => setForm({ ...form, password: e.target.value })}
//       />
//       <p>
//         Нет аккаунта?
//         <span style={{cursor:'pointer'}} onClick={() => setAuthMode('register')}> Регистрация</span>
//       </p>
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <button type="submit">Войти</button>
//     </form>
//   )
// }
import { useContext, useState } from 'react'
import { Myinput } from '../../../UI/input/Myinput'
import { AuthContext } from '../../../context/context'
import styles from './Login.module.css'  
import icon_hidden from '../../../assets/icon_hidden.png'
import icon_eye from '../../../assets/icon_eye.png'

export const Login = ({ onSuccess, setAuthMode }) => {
  const { login, error } = useContext(AuthContext)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const success = await login(form.email, form.password)
      console.log('success:', success)  // ← добавить
  console.log('onSuccess:', onSuccess)  
    if (success) {
     console.log('✅ Вызываем onSuccess')
      onSuccess?.()
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
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <img src={icon_hidden}/> : <img src={icon_eye}/>}
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.submitButton}>
        Войти
      </button>

      <p className={styles.footerText}>
        Нет аккаунта?{' '}
        <span 
          className={styles.link}
          onClick={() => setAuthMode('register')}
        >
          Зарегистрироваться
        </span>
      </p>
    </form>
  )
}