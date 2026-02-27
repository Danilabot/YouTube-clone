import Navbar from './Components/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import { Home } from './Pages/Home/Home'
import Video from './Pages/Video/Video'
import { API_KEY } from './utils/data'
import { useEffect, useState } from 'react'
import { useVideo } from './useHocks/useVideos'
import { Profile } from './Components/Profile/Profile'
import { MyModal } from './UI/MyModal/Modal'
import {Login} from './Components/Authhorization/Login/Login'
import { AuthProvider } from './context/AuthProvider'
import Register from './Components/Authhorization/Registration/Registration'
import Channel from './Pages/Channel/Channel'

const App = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [sidebar, setSidebar] = useState(true)
  const [data, setData] = useState([])
  const [category, setCategory] = useState(0)
  const [filter, setFilter] = useState({ sort: '', query: '' })
  const sortedAndSearchedPosts = useVideo(data, filter.sort, filter.query)
  const [modal, setModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const fetchData = async () => {
    const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=100&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`
    await fetch(videoList_url)
      .then((res) => res.json())
      .then((data) => setData(data.items))
  }

  useEffect(() => {
    fetchData()
  }, [category])

  return (
    <AuthProvider>
      <div>
        <Navbar
          setSidebar={setSidebar}
          filter={filter}
          setFilter={setFilter}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        <Profile isOpen={isOpen} setModal={setModal} setIsOpen={setIsOpen} setAuthMode={setAuthMode} />
        <MyModal visible={modal} setVisible={setModal}>
          {authMode ==='login'?<Login setAuthMode={setAuthMode}  onSuccess={() => setModal(false)}/> : <Register setAuthMode={setAuthMode}/>}
        </MyModal>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                sidebar={sidebar}
                data={sortedAndSearchedPosts}
                setCategory={setCategory}
                category={category}
              />
            }
          />
          <Route path="/video/:categoryId/:videoId" element={<Video />} />
          <Route path='/channel/:channelId' element={<Channel />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
