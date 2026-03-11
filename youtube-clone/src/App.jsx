import Navbar from './Components/Navbar/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Home } from './Pages/Home/Home'
import Video from './Pages/Video/Video'
import { API_KEY } from './utils/data'
import { useEffect, useState } from 'react'
import { useVideo } from './useHocks/useVideos'
import { Profile } from './Components/Profile/Profile'
import { MyModal } from './UI/MyModal/Modal'
import { Login } from './Components/Authhorization/Login/Login'
import Register from './Components/Authhorization/Registration/Registration'
import Channel from './Pages/Channel/Channel'
import { useDispatch } from 'react-redux'
import { setCredentials } from './redux/slices/authSlice'
import {SearchResults} from './Pages/SearchResults/SearchResults'
import {SavedVideo} from './Pages/SavedVideos/SavedVideos'
import {Toaster} from 'react-hot-toast'
import {MobileNavbar} from './Components/MobileNavbar/MobileNavbar'
import { fetchPopularVideos } from './api/videos'
import { useQuery } from '@tanstack/react-query'

const App = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [sidebar, setSidebar] = useState(true)
  const [category, setCategory] = useState(0)
  const [filter, setFilter] = useState({ sort: '', query: '' })
  const [modal, setModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const dispatch = useDispatch()
  const location = useLocation()

  const {data:videos =[], isLoading, error} = useQuery({
    queryKey: ['videos', category],
    queryFn: () => fetchPopularVideos(category),
    staleTime: 5 * 60 * 1000, // кэш на 5 минут
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      dispatch(
        setCredentials({
          user: JSON.parse(user),
          token,
        }),
      )
    }
  }, [dispatch])

  return (
    <div>
       <Toaster 
        position="bottom-right"  
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Navbar
        setSidebar={setSidebar}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <Profile
        isOpen={isOpen}
        setModal={setModal}
        setIsOpen={setIsOpen}
        setAuthMode={setAuthMode}
      />
      <MyModal visible={modal} setVisible={setModal}>
        {authMode === 'login' ? (
          <Login setAuthMode={setAuthMode} onSuccess={() => setModal(false)} />
        ) : (
          <Register setAuthMode={setAuthMode} onSuccess={() => setModal(false)}/>
        )}
      </MyModal>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              sidebar={sidebar}
              setCategory={setCategory}
              category={category}
              data={videos} 
            />
          }
        />
        <Route
          path="/video/:categoryId/:videoId"
          element={<Video key={location.key} />}
        />
        <Route path="/channel/:channelId" element={<Channel />} />
        <Route path="/search" element={<SearchResults  sidebar={sidebar}
              setCategory={setCategory}
              category={category}/>} />
        <Route path='/saved' element={<SavedVideo />} />
      </Routes>
      <MobileNavbar />
    </div>
  )
}

export default App
