import { useEffect } from 'react'
import './Profile.css'
import { logout } from '../../redux/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { toggleTheme } from '../../redux/slices/themeSlice'
import { Link } from 'react-router-dom'


export const Profile = ({ isOpen, setModal, setIsOpen, setAuthMode }) => {
  const dispatch = useAppDispatch()
  const isDark = useAppSelector((state) => state.theme.isDark)
  const user = useAppSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsOpen(false)
  }
  // Закрытие по ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
    }
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, setIsOpen])
  useEffect(() => {
     console.log('Theme changed:', isDark)
  if (isDark) {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }
}, [isDark])

  // Закрытие при клике вне меню
  const handleBackdropClick = () => {
    setIsOpen(false)
  }

  const openLogin = () => {
    setAuthMode('login')
    setIsOpen(false)
    setModal(true)
  }

  const openRegister = () => {
    setAuthMode('register')
    setIsOpen(false)
    setModal(true)
  }

  return (
    <>
      <div
        className={`menu-backdrop ${isOpen ? 'active' : ''}`}
        onClick={handleBackdropClick}
      />

      <nav className={`menu ${isOpen ? 'active' : ''}`}>
        {user && (
          <div className="menu_user">
            <div className="menu_user_name">{user.name}</div>
            <div className="menu_user_email">{user.email}</div>
          </div>
        )}

        <ul className="menu_list">
          <li className="menu_item" onClick={openLogin}>
            <span>Вход</span>
          </li>
          <li className="menu_item" onClick={openRegister}>
            <span>Регистрация</span>
          </li>
          <li className="menu_item">
            <Link to={`/saved`}>
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
