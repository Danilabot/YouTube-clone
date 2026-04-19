import './PlayVideo.css'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useVideoData, useChannelData, useVideoComments } from '../../hooks/useVideoData'
import { addToHistory } from '../../utils/history'
import { saveProgress, getProgress } from '../../utils/watchProgress'
import { parseDurationToSeconds } from '../../utils/formatDuration'
import { showMiniPlayer, hideMiniPlayer } from '../../redux/slices/miniPlayerSlice'
import { useAppDispatch } from '../../redux/hooks'
import VideoPlayer from './VideoPlayer'
import VideoMeta from './VideoMeta'
import ChannelInfo from './ChannelInfo'
import VideoDescription from './VideoDescription'
import CommentList from './CommentList'

interface PlayVideoProps {
  likes: number
  liked: boolean
  handleLike: () => void
  disliked: boolean
  handleDislike: () => void
}

const PlayVideo = ({ likes, liked, handleLike, disliked, handleDislike }: PlayVideoProps) => {
  const { videoId } = useParams<{ videoId: string }>()
  const dispatch = useAppDispatch()

  const { data: videoData } = useVideoData(videoId ?? '')
  const { data: channelInfo } = useChannelData(videoData?.snippet?.channelId)
  const { data: comments = [] } = useVideoComments(videoId ?? '')

  const playerRef = useRef<HTMLDivElement>(null)
  const elapsedRef = useRef(0)

  // Keep latest data accessible in cleanup closures
  const latestRef = useRef<{ videoId: string; videoData: typeof videoData }>({
    videoId: videoId ?? '',
    videoData: undefined,
  })
  useEffect(() => {
    latestRef.current = { videoId: videoId ?? '', videoData }
  })

  // Hide mini player on enter, show it on leave
  useEffect(() => {
    dispatch(hideMiniPlayer())
    return () => {
      const { videoId: vid, videoData: vd } = latestRef.current
      if (vid && vd) {
        dispatch(showMiniPlayer({
          videoId: vid,
          categoryId: vd.snippet?.categoryId ?? '0',
          title: vd.snippet?.title ?? '',
          channelTitle: vd.snippet?.channelTitle ?? '',
          thumbnail: vd.snippet?.thumbnails?.medium?.url ?? '',
        }))
      }
    }
  }, [dispatch])

  // IntersectionObserver: show mini player when player scrolls out of view
  useEffect(() => {
    const el = playerRef.current
    if (!el || !videoData || !videoId) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dispatch(hideMiniPlayer())
        } else {
          dispatch(showMiniPlayer({
            videoId,
            categoryId: videoData.snippet?.categoryId ?? '0',
            title: videoData.snippet?.title ?? '',
            channelTitle: videoData.snippet?.channelTitle ?? '',
            thumbnail: videoData.snippet?.thumbnails?.medium?.url ?? '',
          }))
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [videoId, videoData, dispatch])

  // Progress tracker
  useEffect(() => {
    if (!videoId || !videoData) return

    const durationSec = parseDurationToSeconds(videoData.contentDetails?.duration)
    if (!durationSec) return

    const existing = getProgress(videoId)
    elapsedRef.current = Math.floor((existing / 100) * durationSec)

    const timer = setInterval(() => {
      elapsedRef.current += 5
      const progress = Math.min((elapsedRef.current / durationSec) * 100, 97)
      saveProgress(videoId, progress)
    }, 5000)

    return () => clearInterval(timer)
  }, [videoId, videoData])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [videoId])

  useEffect(() => {
    if (videoData) addToHistory(videoData)
  }, [videoData])

  if (!videoData || !videoId) return null

  return (
    <div className="play-video">
      <div ref={playerRef}>
        <VideoPlayer videoId={videoId} />
      </div>
      <VideoMeta
        videoData={videoData}
        likes={likes}
        liked={liked}
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
