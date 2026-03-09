import dislike from '../../../assets/dislike.png'
import './Dislike.css'

const Dislike = ({ disliked, onDislike }) => {
  return (
    
    <button
      className={`dislike-btn ${disliked ? 'disliked' : ''}`}
      onClick={onDislike}
    >
      <img src={dislike} alt="" /> 
    </button>
  );
};

export default Dislike;
