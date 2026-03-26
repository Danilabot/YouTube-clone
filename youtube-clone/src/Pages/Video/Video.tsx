import { useParams } from 'react-router-dom'
import PlayVideo from '../../Components/PlayVideo/PlayVideo'
import Recommended from '../../Components/Recommended/Recommended'
import './Videp.css'
import { useEffect, useState } from 'react'
import { getLikesCount, getLikeStatus, toggleLike } from '../../api/likes'
import { getDislikeStatus, toggleDislike } from '../../api/dislike'
import { getToken } from '../../utils/auth'

const Video = () => {
  const { videoId, categoryId } = useParams<{ videoId: string; categoryId: string }>()
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [dislikes, setDislikes] = useState(0)
  const [disliked, setDisliked] = useState(false)

  useEffect(() => {
    if (!videoId) return
    setLiked(false)
    setLikes(0)
    setDisliked(false)
    setDislikes(0)

    const loadLikes = async () => {
      const countRes = await getLikesCount(videoId)
      setLikes(Number(countRes.likes) || 0)
      if (getToken()) {
        const statusRes = await getLikeStatus(videoId)
        setLiked(statusRes.liked)
        const dislikeStatus = await getDislikeStatus(videoId)
        setDisliked(dislikeStatus.disliked)
      }
    }
    loadLikes()
  }, [videoId])

  const handleLike = async () => {
    if (!getToken()) {
      alert('Войдите в аккаунт')
      return
    }
    if (!videoId) return

    try {
      const res = await toggleLike(videoId)
      setLiked(res.liked)
      setLikes((prev) => (res.liked ? prev + 1 : prev - 1))

      if (res.liked && disliked) {
        setDisliked(false)
        setDislikes((prev) => prev - 1)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDislike = async () => {
    if (!getToken()) {
      alert('Войдите в аккаунт')
      return
    }
    if (!videoId) return

    try {
      const res = await toggleDislike(videoId)
      setDisliked(res.disliked)
      setDislikes(res.dislikesCount)

      if (res.disliked && liked) {
        setLiked(false)
        setLikes((prev) => prev - 1)
        await toggleLike(videoId)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="play-container">
      <PlayVideo
        likes={likes}
        liked={liked}
        handleLike={handleLike}
        dislikes={dislikes}
        disliked={disliked}
        handleDislike={handleDislike}
      />
      <Recommended categoryId={categoryId} />
    </div>
  )
}

export default Video
