import { useParams } from 'react-router-dom'
import PlayVideo from '../../Components/PlayVideo/PlayVideo'
import Recommended from '../../Components/Recommended/Recommended'
import './Videp.css'
import { useEffect, useState } from 'react'
import { getLikesCount, getLikeStatus, toggleLike } from '../../api/likes'

const Video = () => {
  const { videoId, categoryId } = useParams()
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const loadLikes = async () => {
      setLoading(true)
      const countRes = await getLikesCount(videoId)
      setLikes(countRes.likes)
      if (localStorage.getItem('token')) {
        const statusRes = await getLikeStatus(videoId)
        setLiked(statusRes.liked)
      }
      setLoading(false)
    }
    loadLikes()
  }, [videoId])

 const handleLike = async () => {
  if (!localStorage.getItem('token')) {
    alert('Войдите в аккаунт')
    return
  }

  try {
    const res = await toggleLike(videoId)

    setLiked(res.liked)
    setLikes(res.likesCount)
  } catch (err) {
    console.error(err)
  }
}
  return (
    <div className="play-container">
      <PlayVideo
        videoId={videoId}
        likes={likes}
        liked={liked}
        handleLike={handleLike}
      />
      <Recommended categoryId={categoryId} />
    </div>
  )
}

export default Video
