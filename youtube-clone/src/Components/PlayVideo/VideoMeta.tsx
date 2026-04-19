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
  disliked: boolean
  onLike: () => void
  onDislike: () => void
}

const VideoMeta = ({ videoData, likes, liked, disliked, onLike, onDislike }: VideoMetaProps) => (
  <>
    <h3>{videoData.snippet.title}</h3>
    <div className="play-video-info">
      <p>
        {formatNumber(videoData.statistics.viewCount)} просмотров &bull;{' '}
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
          <Dislike disliked={disliked} onDislike={onDislike} />
        </span>
        <span>
          <SaveButton videoId={videoData.id} videoData={videoData} />
        </span>
      </div>
    </div>
  </>
)

export default VideoMeta
