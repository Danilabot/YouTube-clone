import './LikeButton.css';

const LikeButton = ({ totalLikes, liked, onLike }) => {
  return (
    <button
      className={`like-btn ${liked ? 'liked' : ''}`}
      onClick={onLike}
    >
      👍 {totalLikes}
    </button>
  );
};

export default LikeButton;
