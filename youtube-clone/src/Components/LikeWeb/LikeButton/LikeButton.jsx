import './LikeButton.css';
import like from '../../../assets/like.png'

const LikeButton = ({ totalLikes, liked, onLike }) => {
  return (
    
    <button
      className={`like-btn ${liked ? 'liked' : ''}`}
      onClick={onLike}
    >
      <img src={like} alt="" /> {totalLikes}
    </button>
  );
};

export default LikeButton;
