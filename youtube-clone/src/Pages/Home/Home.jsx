import Sidebar from '../../Components/Sidebar/Sidebar'
import Feed from '../../Components/Feed/Feed'
import './Home.css'
import { useState, useEffect } from 'react'
import {VideoSkeleton} from '../Video/VideoSkeleton'


export const Home = ({sidebar, data, category, setCategory}) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (data && data.length > 0) {
      setLoading(false)
    }
  }, [data])

  

  return (
    <>
      <Sidebar sidebar={sidebar} category={category} setCategory={setCategory} />
      <div className={`container ${sidebar ? "" : 'large-container'}`}>
        {loading ? (
          <div className='feed'>
            {Array(50).fill(0).map((_, i) => (
              <VideoSkeleton key={i} />
            ))}
          </div>
        ) : (
          <Feed data={data} />
        )}
      </div>
    </>
  )
}