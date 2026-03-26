import dislike from '../../assets/dislike.png'
import { formatDistanceToNow } from 'date-fns'
import { LikeComment } from '../LikeWeb/LikeComment/LIkeComment'
import type { YouTubeCommentThread } from '../../types/youtube'

interface CommentListProps {
  comments: YouTubeCommentThread[]
}

const CommentList = ({ comments }: CommentListProps) => (
  <>
    {comments.map((item) => {
      const comment = item.snippet.topLevelComment.snippet
      return (
        <div key={item.id} className="comment">
          <img src={comment.authorProfileImageUrl} alt="" />
          <div>
            <h3>
              {comment.authorDisplayName}{' '}
              <span>
                {formatDistanceToNow(new Date(comment.publishedAt), { addSuffix: true })}
              </span>
              <p>{comment.textDisplay}</p>
              <div className="comment-action">
                <LikeComment commentId={item.id} initialLikes={comment.likeCount} />
                <img src={dislike} alt="" />
              </div>
            </h3>
          </div>
        </div>
      )
    })}
  </>
)

export default CommentList
