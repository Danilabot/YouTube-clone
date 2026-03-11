import './Navbar.css'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import menu_icon from '../../assets/menu.png'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search.png'
import upload_icon from '../../assets/upload.png'
import more_icon from '../../assets/more.png'
import notification_icon from '../../assets/notification.png'
import profile_icon from '../../assets/jack.png'
import { Myinput } from '../../UI/input/Myinput'
import { useState } from 'react'

const Navbar = ({ setSidebar, isOpen, setIsOpen }) => {
  const [searchQuery,setSearchQuery] = useState('')
  const navigate = useNavigate()

   const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')  // очистить после поиска
    }
  }

  return (
    <nav className="flex-div">
      <div className="nav-left flex-div">
        <img
          className="menu-icon"
          onClick={() => setSidebar((prev) => (prev === false ? true : false))}
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
            placeholder="Search"
          />
          <button type='submit'>
          <img  src={search_icon} alt="" />
          </button>
          </form>
        
      </div>
      <div className="nav-right flex-div">
        <img src={upload_icon} alt="" />
        <img src={more_icon} alt="" />
        <img src={notification_icon} alt="" />
        <img src={profile_icon} className="user-icon" alt="" onClick={()=> setIsOpen(!isOpen)}/>
      </div>
    </nav>
  )
}

export default Navbar
