import { useContext, useEffect } from 'react'
import './Profile.css'
import { AuthContext } from '../../context/context'

export const Profile = ({ isOpen, setModal, setIsOpen, setAuthMode }) => {
  const { logout, user } = useContext(AuthContext)

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
      {/* Затемнение фона */}
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

          <div className="menu_divider" />

          <li className="menu_item">
            <span>Настройки</span>
          </li>
          <li className="menu_item">
            <span>Помощь</span>
          </li>

          <div className="menu_divider" />

          <li className="menu_item logout" onClick={logout}>
            <span>Выйти</span>
          </li>
        </ul>
      </nav>
    </>
  )
}