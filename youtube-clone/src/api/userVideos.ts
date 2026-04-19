import { API_BASE_URL } from './config'
import { getToken } from '../utils/auth'

const API_URL = `${API_BASE_URL}/api/user-videos`

export interface UserVideoRecord {
  id: number
  userId: number
  title: string
  description: string | null
  videoUrl: string
  thumbnailUrl: string | null
  duration: number | null
  viewCount: number
  isPublic: boolean
  createdAt: string
  author?: { id: number; name: string; avatar: string | null }
}

export const createUserVideo = async (data: {
  title: string
  description?: string
  videoUrl: string
  thumbnailUrl?: string
  duration?: number
}): Promise<{ success: boolean; video: UserVideoRecord }> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const getMyVideos = async (): Promise<{ success: boolean; videos: UserVideoRecord[] }> => {
  const res = await fetch(`${API_URL}/my`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return res.json()
}

export const getPublicVideos = async (): Promise<{ success: boolean; videos: UserVideoRecord[] }> => {
  const res = await fetch(API_URL)
  return res.json()
}

export const getUserVideoById = async (
  id: string,
): Promise<{ success: boolean; video: UserVideoRecord }> => {
  const res = await fetch(`${API_URL}/${id}`)
  return res.json()
}

export const deleteUserVideo = async (id: number): Promise<{ success: boolean }> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return res.json()
}
