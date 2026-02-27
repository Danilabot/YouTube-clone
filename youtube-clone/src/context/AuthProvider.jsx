import { useState, useEffect,useContext } from 'react'
import { AuthContext } from './context'

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuth: localStorage.getItem('token') !== null,
    user: localStorage.getItem('user') || null,
    error: null,
    isLoading: false,
  })
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      try {
        setAuthState({
          isAuth: true,
          user: JSON.parse(user),
          error: null,
          isLoading: false,
        })
      } catch (error) {
        console.error('Ошибка парсинга user:', error)
        // Очищаем поврежденные данные
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setAuthState((prev) => ({ ...prev, isLoading: false }))
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

 const login = (email, password) => {
  return fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (!res.ok) throw new Error('Ошибка входа')
      return res.json()
    })
    .then((data) => {
      console.log(data)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setAuthState({
        isAuth: true,
        user: data.user,
        error: null,
        isLoading: false,
      })
      return true  // ← возвращаем true
    })
    .catch((error) => {
      console.log(error)
      return false  // ← возвращаем false
    })
}
  const logout = () => {
    setAuthState({
      isAuth: false,
      user: null,
      error: null,
      isLoading: false,
    })
    localStorage.removeItem('isAuth')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => {
  return useContext(AuthContext)
}