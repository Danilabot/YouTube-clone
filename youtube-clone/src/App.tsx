import Navbar from './Components/Navbar/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Home } from './Pages/Home/Home'
import Video from './Pages/Video/Video'
import { useEffect, useState } from 'react'
import { Profile } from './Components/Profile/Profile'
import { MyModal } from './UI/MyModal/Modal'
import { Login } from './Components/Authorization/Login/Login'
import Register from './Components/Authorization/Registration/Registration'
import Channel from './Pages/Channel/Channel'
import { useDispatch } from 'react-redux'
import { setCredentials } from './redux/slices/authSlice'
import { useAppSelector } from './redux/hooks'
import { closeAuthModal } from './redux/slices/uiSlice'
import { SearchResults } from './Pages/SearchResults/SearchResults'
import { SavedVideo } from './Pages/SavedVideos/SavedVideos'
import { History } from './Pages/History/History'
import { UserProfile } from './Pages/UserProfile/UserProfile'
import ShortsPage from './Pages/Shorts/ShortsPage'
import { Toaster } from 'react-hot-toast'
import { MobileNavbar } from './Components/MobileNavbar/MobileNavbar'
import { fetchPopularVideosByCategory, fetchShorts } from './api/youtube'
import { useQuery } from '@tanstack/react-query'
import type { AuthUser } from './redux/slices/authSlice'
import type { YouTubeVideo } from './types/youtube'

const App = () => {
  const [sidebar, setSidebar] = useState(true)
  const [category, setCategory] = useState(0)
  const dispatch = useDispatch()
  const location = useLocation()

  const isAuthModalOpen = useAppSelector((state) => state.ui.isAuthModalOpen)
  const authMode = useAppSelector((state) => state.ui.authMode)
  const isDark = useAppSelector((state) => state.theme.isDark)

  useEffect(() => {
    document.body.classList.toggle('dark', isDark)
  }, [isDark])

  const { data: videos = [] } = useQuery<YouTubeVideo[]>({
    queryKey: ['videos', category],
    queryFn: () => fetchPopularVideosByCategory(category),
    staleTime: 5 * 60 * 1000,
  })

  const { data: shortsData } = useQuery({
    queryKey: ['shorts'],
    queryFn: () => fetchShorts(),
    staleTime: 10 * 60 * 1000,
  })
  const shorts: YouTubeVideo[] = shortsData?.items ?? []

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRaw = localStorage.getItem('user')

    if (token && userRaw) {
      try {
        const user: AuthUser = JSON.parse(userRaw)
        dispatch(setCredentials({ user, token }))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [dispatch])

  return (
    <div>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          style: { background: '#363636', color: '#fff' },
        }}
      />
      <Navbar setSidebar={setSidebar} />
      <Profile />
      <MyModal visible={isAuthModalOpen} setVisible={() => dispatch(closeAuthModal())}>
        {authMode === 'login' ? (
          <Login onSuccess={() => dispatch(closeAuthModal())} />
        ) : (
          <Register onSuccess={() => dispatch(closeAuthModal())} />
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
              shorts={shorts}
            />
          }
        />
        <Route path="/video/:categoryId/:videoId" element={<Video key={location.key} />} />
        <Route path="/channel/:channelId" element={<Channel />} />
        <Route
          path="/search"
          element={
            <SearchResults
              sidebar={sidebar}
              setCategory={setCategory}
              category={category}
            />
          }
        />
        <Route path="/saved" element={<SavedVideo />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/shorts" element={<ShortsPage />} />
      </Routes>
      <MobileNavbar />
    </div>
  )
}

export default App
