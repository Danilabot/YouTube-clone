import house from '../../assets/houseBlack.png'
import saveBlack from '../../assets/saveBlack.png'
import { Link } from 'react-router-dom'
import styles from './MobileNavbar.module.css'

export const MobileNavbar = () => {
  return (
    <nav className={styles['mobile-navbar']}>
      <Link to="/">
        <img src={house} alt="Главная" />
      </Link>
      <Link to="/saved">
        <img src={saveBlack} alt="" />
      </Link>
    </nav>
  )
}
