import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import menu_icon from '../../assets/menu.png'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search.png'
import notification_icon from '../../assets/notification.png'
import profile_icon from '../../assets/jack.png'
import { Myinput } from '../../UI/input/Myinput'
import { useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { openProfileMenu, closeProfileMenu, openAuthModal, openUploadModal } from '../../redux/slices/uiSlice'

interface NavbarProps {
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

const Navbar = ({ setSidebar }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isProfileMenuOpen = useAppSelector((state) => state.ui.isProfileMenuOpen)
  const user = useAppSelector((state) => state.auth.user)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const handleProfileClick = () => {
    dispatch(isProfileMenuOpen ? closeProfileMenu() : openProfileMenu())
  }

  return (
    <nav className="flex-div">
      <div className="nav-left flex-div">
        <img
          className="menu-icon"
          onClick={() => setSidebar((prev) => !prev)}
          src={menu_icon}
          alt=""
        />
        <Link to="/">
          <img className="logo" src={logo} alt="" />
        </Link>
      </div>
      <div className="nav-middle flex-div">
        <form onSubmit={handleSubmit} className="search-box flex-div">
          <Myinput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Поиск"
          />
          <button type="submit">
            <img src={search_icon} alt="" />
          </button>
        </form>
      </div>
      <div className="nav-right flex-div">
        <button
          className="upload-btn"
          onClick={() => user ? dispatch(openUploadModal()) : dispatch(openAuthModal('login'))}
          title="Добавить видео"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM15 16H5V8h10v8zm-4-1h-2v-2H7v-2h2V9h2v2h2v2h-2v2z"/>
          </svg>
          <span>Создать</span>
        </button>
        <img src={notification_icon} alt="Уведомления" className="nav-icon" />
        {user?.avatar ? (
          <img
            src={user.avatar}
            className="user-icon"
            alt=""
            onClick={handleProfileClick}
          />
        ) : (
          <img
            src={profile_icon}
            className="user-icon"
            alt=""
            onClick={handleProfileClick}
          />
        )}
      </div>
    </nav>
  )
}

export default Navbar
