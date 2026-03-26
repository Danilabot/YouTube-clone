import dislike from '../../../assets/dislike.png'
import './Dislike.css'

interface DislikeProps {
  dislikes: number
  disliked: boolean
  onDislike: () => void
}

const Dislike = ({ disliked, onDislike }: DislikeProps) => {
  return (
    <button
      className={`dislike-btn ${disliked ? 'disliked' : ''}`}
      onClick={onDislike}
    >
      <img src={dislike} alt="" />
    </button>
  )
}

export default Dislike
