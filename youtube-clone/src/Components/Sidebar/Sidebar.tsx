import './Sidebar.css'
import home from '../../assets/home.png'
import game_icon from '../../assets/game_icon.png'
import automobiles from '../../assets/automobiles.png'
import sports from '../../assets/sports.png'
import entertainment from '../../assets/entertainment.png'
import tech from '../../assets/tech.png'
import music from '../../assets/music.png'
import blogs from '../../assets/blogs.png'
import news from '../../assets/news.png'
import history from '../../assets/history.png'
import { SubscriptionList } from '../SubscriptionList/SubscriptionList'
import { Link } from 'react-router-dom'

interface SidebarProps {
  sidebar: boolean
  category: number
  setCategory: (category: number) => void
}

interface SidebarLink {
  icon: string
  label: string
  categoryId: number
}

const SIDEBAR_LINKS: SidebarLink[] = [
  { icon: home, label: 'Home', categoryId: 0 },
  { icon: game_icon, label: 'Gaming', categoryId: 20 },
  { icon: automobiles, label: 'Automobiles', categoryId: 2 },
  { icon: sports, label: 'Sports', categoryId: 17 },
  { icon: entertainment, label: 'Entertainment', categoryId: 24 },
  { icon: tech, label: 'Technology', categoryId: 28 },
  { icon: music, label: 'Music', categoryId: 10 },
  { icon: blogs, label: 'Blogs', categoryId: 22 },
  { icon: news, label: 'News', categoryId: 25 },
]

const Sidebar = ({ sidebar, category, setCategory }: SidebarProps) => {
  return (
    <div className={`sidebar ${sidebar ? '' : 'small-sidebar'}`}>
      <div className="shortcut-links">
        {SIDEBAR_LINKS.map(({ icon, label, categoryId }) => (
          <div
            key={categoryId}
            className={`side-link ${category === categoryId ? 'active' : ''}`}
            onClick={() => setCategory(categoryId)}
          >
            <img src={icon} alt="" />
            <p>{label}</p>
          </div>
        ))}
        <Link to="/history" className="side-link">
          <img src={history} alt="" />
          <p>История</p>
        </Link>
        <hr />
      </div>
      <div className="subscribed-list">
        <h3>Subscribed</h3>
        <div className="side-link">
          <SubscriptionList />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
