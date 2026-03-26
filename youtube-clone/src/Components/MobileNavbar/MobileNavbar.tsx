import { Link, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { openAuthModal } from '../../redux/slices/uiSlice'
import styles from './MobileNavbar.module.css'

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
)

const ShortsIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.77 2.71-2.89 1.94-4.73-.77-1.84-2.89-2.71-4.73-1.94L6 5.8C4.16 6.57 3.29 8.69 4.06 10.53c.57 1.36 1.92 2.17 3.31 2.16l-1.2.5C4.33 13.96 3.46 16.08 4.23 17.92c.77 1.84 2.89 2.71 4.73 1.94l8.21-3.41c1.84-.77 2.71-2.89 1.94-4.73-.57-1.36-1.92-2.17-3.34-2.4zM10 14.65V9.35L15 12l-5 2.65z" />
  </svg>
)

const AddIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
)

const SubIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
  </svg>
)

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
)

export const MobileNavbar = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  const active = (path: string) =>
    location.pathname === path ? styles.active : ''

  const handleAdd = () => {
    if (!user) {
      dispatch(openAuthModal('login'))
    }
    // TODO: открыть форму загрузки видео
  }

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={`${styles.item} ${active('/')}`}>
        <HomeIcon />
        <span>Главная</span>
      </Link>

      <Link to="/shorts" className={`${styles.item} ${active('/shorts')}`}>
        <ShortsIcon />
        <span>Шортсы</span>
      </Link>

      <button className={styles.addBtn} onClick={handleAdd}>
        <AddIcon />
      </button>

      <Link to="/profile?tab=subscriptions" className={`${styles.item} ${location.search.includes('subscriptions') && location.pathname === '/profile' ? styles.active : ''}`}>
        <SubIcon />
        <span>Подписки</span>
      </Link>

      <Link to="/profile" className={`${styles.item} ${active('/profile')}`}>
        {user ? (
          <div className={styles.userAvatar}>{user.name.charAt(0).toUpperCase()}</div>
        ) : (
          <ProfileIcon />
        )}
        <span>Профиль</span>
      </Link>
    </nav>
  )
}
