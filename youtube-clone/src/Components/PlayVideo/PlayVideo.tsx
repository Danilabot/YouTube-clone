import './PlayVideo.css'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useVideoData, useChannelData, useVideoComments } from '../../hooks/useVideoData'
import { addToHistory } from '../../utils/history'
import VideoPlayer from './VideoPlayer'
import VideoMeta from './VideoMeta'
import ChannelInfo from './ChannelInfo'
import VideoDescription from './VideoDescription'
import CommentList from './CommentList'

interface PlayVideoProps {
  likes: number
  liked: boolean
  handleLike: () => void
  dislikes: number
  disliked: boolean
  handleDislike: () => void
}

const PlayVideo = ({ likes, liked, handleLike, dislikes, disliked, handleDislike }: PlayVideoProps) => {
  const { videoId } = useParams<{ videoId: string }>()

  const { data: videoData } = useVideoData(videoId ?? '')
  const { data: channelInfo } = useChannelData(videoData?.snippet?.channelId)
  const { data: comments = [] } = useVideoComments(videoId ?? '')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [videoId])

  useEffect(() => {
    if (videoData) addToHistory(videoData)
  }, [videoData])

  if (!videoData || !videoId) return null

  return (
    <div className="play-video">
      <VideoPlayer videoId={videoId} />
      <VideoMeta
        videoData={videoData}
        likes={likes}
        liked={liked}
        dislikes={dislikes}
        disliked={disliked}
        onLike={handleLike}
        onDislike={handleDislike}
      />
      <hr />
      <ChannelInfo channelId={videoData.snippet.channelId} channelData={channelInfo} />
      <VideoDescription
        description={videoData.snippet.description}
        commentCount={videoData.statistics.commentCount ?? '0'}
      />
      <CommentList comments={comments} />
    </div>
  )
}

export default PlayVideo
