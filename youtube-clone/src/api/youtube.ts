import { YOUTUBE_API_KEY as API_KEY } from '../utils/youtubeConfig'
import type {
  YouTubeVideo,
  YouTubeChannel,
  YouTubeCommentThread,
  YouTubeSearchResult,
  YouTubeShortsResponse,
} from '../types/youtube'

const BASE = 'https://youtube.googleapis.com/youtube/v3'

export const fetchPopularVideosByCategory = async (categoryId: number): Promise<YouTubeVideo[]> => {
  let allVideos: YouTubeVideo[] = []
  let pageToken = ''

  for (let i = 0; i < 2; i++) {
    const url = `${BASE}/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`
    const res = await fetch(url)
    const data: { items: YouTubeVideo[]; nextPageToken?: string } = await res.json()
    allVideos = [...allVideos, ...data.items]
    pageToken = data.nextPageToken ?? ''
    if (!pageToken) break
  }

  for (let i = allVideos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allVideos[i], allVideos[j]] = [allVideos[j], allVideos[i]]
  }

  return allVideos
}

export const fetchVideoDetails = async (videoId: string): Promise<YouTubeVideo> => {
  const url = `${BASE}/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`
  const res = await fetch(url)
  const data: { items: YouTubeVideo[] } = await res.json()
  return data.items[0]
}

export const fetchChannelDetails = async (channelId: string): Promise<YouTubeChannel> => {
  const url = `${BASE}/channels?part=snippet%2CcontentDetails%2Cstatistics%2CbrandingSettings&id=${channelId}&key=${API_KEY}`
  const res = await fetch(url)
  const data: { items: YouTubeChannel[] } = await res.json()
  return data.items[0]
}

export const fetchVideoComments = async (videoId: string): Promise<YouTubeCommentThread[]> => {
  const url = `${BASE}/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`
  const res = await fetch(url)
  const data: { items?: YouTubeCommentThread[] } = await res.json()
  return data.items ?? []
}

export const fetchChannelVideos = async (channelId: string): Promise<YouTubeVideo[]> => {
  const searchUrl = `${BASE}/search?part=snippet&channelId=${channelId}&maxResults=20&order=date&type=video&key=${API_KEY}`
  const searchRes = await fetch(searchUrl)
  const searchData: { items: YouTubeSearchResult[] } = await searchRes.json()

  const videoIds = searchData.items.map((item) => item.id.videoId).filter(Boolean).join(',')
  const videosUrl = `${BASE}/videos?part=snippet%2Cstatistics%2CcontentDetails&id=${videoIds}&key=${API_KEY}`
  const videosRes = await fetch(videosUrl)
  const videosData: { items?: YouTubeVideo[] } = await videosRes.json()

  return videosData.items ?? []
}

export const searchVideos = async (query: string): Promise<YouTubeSearchResult[]> => {
  const url = `${BASE}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=20&key=${API_KEY}`
  const res = await fetch(url)
  const data: { items?: YouTubeSearchResult[] } = await res.json()
  return data.items ?? []
}

export const fetchVideoDetailsBatch = async (videoIds: string[]): Promise<YouTubeVideo[]> => {
  if (videoIds.length === 0) return []
  const url = `${BASE}/videos?part=snippet%2Cstatistics%2CcontentDetails&id=${videoIds.join(',')}&key=${API_KEY}`
  const res = await fetch(url)
  const data: { items?: YouTubeVideo[] } = await res.json()
  return data.items ?? []
}

export const fetchChannelsBatch = async (channelIds: string[]): Promise<YouTubeChannel[]> => {
  if (channelIds.length === 0) return []
  const url = `${BASE}/channels?part=snippet&id=${channelIds.join(',')}&key=${API_KEY}`
  const res = await fetch(url)
  const data: { items?: YouTubeChannel[] } = await res.json()
  return data.items ?? []
}

export const fetchShorts = async (pageToken?: string): Promise<YouTubeShortsResponse> => {
  const tokenParam = pageToken ? `&pageToken=${pageToken}` : ''
  const searchUrl = `${BASE}/search?part=snippet&q=%23shorts&type=video&videoDuration=short&maxResults=20&regionCode=US${tokenParam}&key=${API_KEY}`
  const searchRes = await fetch(searchUrl)
  const searchData: { items?: YouTubeSearchResult[]; nextPageToken?: string } = await searchRes.json()
  if (!searchData.items?.length) return { items: [], nextPageToken: null }

  const videoIds = searchData.items.map((item) => item.id.videoId).filter(Boolean).join(',')
  const videosUrl = `${BASE}/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoIds}&key=${API_KEY}`
  const videosRes = await fetch(videosUrl)
  const videosData: { items?: YouTubeVideo[] } = await videosRes.json()
  return {
    items: videosData.items ?? [],
    nextPageToken: searchData.nextPageToken ?? null,
  }
}
