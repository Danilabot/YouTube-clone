import { useEffect } from 'react'
import './Profile.css'
import { logout } from '../../redux/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { toggleTheme } from '../../redux/slices/themeSlice'
import { closeProfileMenu, openAuthModal } from '../../redux/slices/uiSlice'
import { Link } from 'react-router-dom'

export const Profile = () => {
  const dispatch = useAppDispatch()
  const isDark = useAppSelector((state) => state.theme.isDark)
  const user = useAppSelector((state) => state.auth.user)
  const isProfileMenuOpen = useAppSelector((state) => state.ui.isProfileMenuOpen)

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

  return (
    <>
      <div
        className={`menu-backdrop ${isProfileMenuOpen ? 'active' : ''}`}
        onClick={() => dispatch(closeProfileMenu())}
      />

      <nav className={`menu ${isProfileMenuOpen ? 'active' : ''}`}>
        {user && (
          <div className="menu_user">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="menu_user_avatar" />
            ) : (
              <div className="menu_user_avatar_placeholder">{user.name.charAt(0).toUpperCase()}</div>
            )}
            <div>
              <div className="menu_user_name">{user.name}</div>
              <div className="menu_user_email">{user.email}</div>
            </div>
          </div>
        )}

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
