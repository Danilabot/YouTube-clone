import { API_BASE_URL } from './config'
import { getToken } from '../utils/auth'

const API_URL = `${API_BASE_URL}/api/videos`

export interface LikesCountResponse {
  likes: number
}

export interface LikeStatusResponse {
  liked: boolean
}

export const getLikesCount = async (videoId: string): Promise<LikesCountResponse> => {
  const res = await fetch(`${API_URL}/${videoId}`)
  return res.json()
}

export const getLikeStatus = async (videoId: string): Promise<LikeStatusResponse> => {
  const res = await fetch(`${API_URL}/${videoId}/like-status`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}

export const toggleLike = async (videoId: string): Promise<LikeStatusResponse> => {
  const res = await fetch(`${API_URL}/${videoId}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}
