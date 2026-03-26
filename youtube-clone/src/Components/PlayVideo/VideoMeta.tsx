import { formatDistanceToNow } from 'date-fns'
import { formatNumber } from '../../utils/formatNumber'
import LikeButton from '../LikeWeb/LikeButton/LikeButton'
import Dislike from '../LikeWeb/Dislike/Dislike'
import { SaveButton } from '../SaveButton/SaveButton'
import type { YouTubeVideo } from '../../types/youtube'

interface VideoMetaProps {
  videoData: YouTubeVideo
  likes: number
  liked: boolean
  dislikes: number
  disliked: boolean
  onLike: () => void
  onDislike: () => void
}

const VideoMeta = ({ videoData, likes, liked, dislikes, disliked, onLike, onDislike }: VideoMetaProps) => (
  <>
    <h3>{videoData.snippet.title}</h3>
    <div className="play-video-info">
      <p>
        {formatNumber(videoData.statistics.viewCount)} Views &bull;{' '}
        {formatDistanceToNow(new Date(videoData.snippet.publishedAt), { addSuffix: true })}
      </p>
      <div>
        <span>
          <LikeButton
            totalLikes={Number(videoData.statistics.likeCount) + likes}
            liked={liked}
            onLike={onLike}
          />
        </span>
        <span>
          <Dislike dislikes={dislikes} disliked={disliked} onDislike={onDislike} />
        </span>
        <span>
          <SaveButton videoId={videoData.id} videoData={videoData} />
        </span>
      </div>
    </div>
  </>
)

export default VideoMeta
