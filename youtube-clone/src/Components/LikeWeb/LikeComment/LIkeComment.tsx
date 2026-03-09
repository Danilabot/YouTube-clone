import like from '../../../assets/like.png'
import { useState, useEffect } from 'react'
import { getLikesCount, getLikeStatus, toggleLike } from '../../../api/likesComment'

interface LikeCommentProps {
  commentId: string
  initialLikes: number
}

export const LikeComment = ({ initialLikes, commentId }: LikeCommentProps) => {
  const [liked, setLiked] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState<number>(initialLikes)

  useEffect(() => {
    const loadData = async () => {
      // Загружаю количество с сервера
      const countRes = await getLikesCount(commentId)
      setLikeCount(countRes.likes)

      // Загружаю статус, если есть токен
      if (localStorage.getItem('token')) {
        const statusRes = await getLikeStatus(commentId)
        setLiked(statusRes.liked)
      }
    }
    loadData()
  }, [commentId])

  const handleLike = async () => {
    if (!localStorage.getItem('token')) {
      alert('Войдите чтобы ставить лайки')
      return
    }

    try {
      const res = await toggleLike(commentId)
      setLiked(res.liked)
      setLikeCount(prev => res.liked ? prev + 1 : prev - 1)
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }

  return (
    <button
      className={`like-btn ${liked ? 'liked' : ''}`}
      onClick={handleLike}
    >
      <img src={like} alt="" /> {likeCount}
    </button>
  )
}