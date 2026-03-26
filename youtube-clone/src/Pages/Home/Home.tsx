import Sidebar from '../../Components/Sidebar/Sidebar'
import Feed from '../../Components/Feed/Feed'
import './Home.css'
import { useState, useEffect } from 'react'
import { VideoSkeleton } from '../Video/VideoSkeleton'
import type { YouTubeVideo } from '../../types/youtube'

interface HomeProps {
  sidebar: boolean
  data: YouTubeVideo[]
  category: number
  setCategory: (category: number) => void
  shorts: YouTubeVideo[]
}

export const Home = ({ sidebar, data, category, setCategory, shorts }: HomeProps) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (data?.length) {
      setLoading(false)
    }
  }, [data?.length])

  return (
    <>
      <Sidebar sidebar={sidebar} category={category} setCategory={setCategory} />
      <div className={`container ${sidebar ? '' : 'large-container'}`}>
        {loading ? (
          <div className="feed">
            {Array.from({ length: 50 }, (_, i) => (
              <VideoSkeleton key={i} />
            ))}
          </div>
        ) : (
          <Feed data={data} shorts={shorts} />
        )}
      </div>
    </>
  )
}
