import './LikeButton.css'
import like from '../../../assets/like.png'

interface LikeButtonProps {
  totalLikes: number
  liked: boolean
  onLike: () => void
}

const LikeButton = ({ totalLikes, liked, onLike }: LikeButtonProps) => {
  return (
    <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={onLike}>
      <img src={like} alt="" /> {totalLikes}
    </button>
  )
}

export default LikeButton
