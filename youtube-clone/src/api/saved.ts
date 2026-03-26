import { API_BASE_URL } from './config'
import { getToken } from '../utils/auth'
import type { YouTubeVideo } from '../types/youtube'

const API_URL = `${API_BASE_URL}/api/saved`

export interface SavedVideoRecord {
  videoId: string
  videoData?: YouTubeVideo
  createdAt?: string
}

export interface SaveResponse {
  success: boolean
  saved: boolean
}

export interface SavedVideosResponse {
  success: boolean
  savedVideos: SavedVideoRecord[]
}

export const saveVideo = async (videoId: string, videoData?: YouTubeVideo): Promise<SaveResponse> => {
  const res = await fetch(`${API_URL}/${videoId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ videoData }),
  })
  return res.json()
}

export const unsaveVideo = async (videoId: string): Promise<SaveResponse> => {
  const res = await fetch(`${API_URL}/${videoId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}

export const getSavedVideos = async (): Promise<SavedVideosResponse> => {
  const res = await fetch(`${API_URL}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}

export const getSaveStatus = async (videoId: string): Promise<SaveResponse> => {
  const res = await fetch(`${API_URL}/${videoId}/status`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}
