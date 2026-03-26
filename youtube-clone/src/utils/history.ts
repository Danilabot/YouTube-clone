import type { YouTubeVideo } from '../types/youtube'

export interface HistoryItem {
  id: string
  title: string
  channelTitle: string
  thumbnail: string
  categoryId: string
  watchedAt: string
}

const KEY = 'yt_watch_history'
const MAX = 100

export const addToHistory = (video: YouTubeVideo): void => {
  const item: HistoryItem = {
    id: video.id,
    title: video.snippet.title,
    channelTitle: video.snippet.channelTitle,
    thumbnail: video.snippet.thumbnails?.medium?.url ?? '',
    categoryId: video.snippet.categoryId ?? '0',
    watchedAt: new Date().toISOString(),
  }
  const prev = getHistory().filter((h) => h.id !== item.id)
  localStorage.setItem(KEY, JSON.stringify([item, ...prev].slice(0, MAX)))
}

export const getHistory = (): HistoryItem[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export const clearHistory = (): void => {
  localStorage.removeItem(KEY)
}
