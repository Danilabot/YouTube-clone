import { API_BASE_URL } from './config'
import { getToken } from '../utils/auth'

const API_URL = `${API_BASE_URL}/api/videos`

export interface DislikeStatusResponse {
  disliked: boolean
  dislikesCount: number
}

export const getDislikeStatus = async (videoId: string): Promise<DislikeStatusResponse> => {
  const res = await fetch(`${API_URL}/${videoId}/dislike-status`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}

export const toggleDislike = async (videoId: string): Promise<DislikeStatusResponse> => {
  const res = await fetch(`${API_URL}/${videoId}/dislike`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}
