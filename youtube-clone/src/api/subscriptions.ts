import { API_BASE_URL } from './config'
import { getToken } from '../utils/auth'

const API_URL = `${API_BASE_URL}/api/subscriptions`

export const getSubscriptionStatus = async (channelId: string): Promise<{ isSubscribed: boolean }> => {
  const res = await fetch(`${API_URL}/status/${channelId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return res.json()
}

export const subscribeToChannel = async (channelId: string): Promise<void> => {
  await fetch(`${API_URL}/${channelId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  })
}

export const unsubscribeFromChannel = async (channelId: string): Promise<void> => {
  await fetch(`${API_URL}/${channelId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  })
}

export const getMySubscriptions = async (): Promise<{ channelId: string }[]> => {
  const res = await fetch(`${API_URL}/my`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return res.json()
}
