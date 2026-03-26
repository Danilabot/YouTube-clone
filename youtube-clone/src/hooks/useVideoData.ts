import { useQuery } from '@tanstack/react-query'
import { fetchVideoDetails, fetchChannelDetails, fetchVideoComments } from '../api/youtube'

export const useVideoData = (videoId: string) =>
  useQuery({
    queryKey: ['video', videoId],
    queryFn: () => fetchVideoDetails(videoId),
    enabled: !!videoId,
  })

export const useChannelData = (channelId: string | undefined) =>
  useQuery({
    queryKey: ['channel', channelId],
    queryFn: () => fetchChannelDetails(channelId!),
    enabled: !!channelId,
  })

export const useVideoComments = (videoId: string) =>
  useQuery({
    queryKey: ['comments', videoId],
    queryFn: () => fetchVideoComments(videoId),
    enabled: !!videoId,
  })
