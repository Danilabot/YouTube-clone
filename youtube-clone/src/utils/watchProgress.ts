const KEY = 'yt_watch_progress'

interface ProgressStore {
  [videoId: string]: number // 0–100
}

const load = (): ProgressStore => {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') } catch { return {} }
}

export const getProgress = (videoId: string): number => load()[videoId] ?? 0

export const saveProgress = (videoId: string, progress: number) => {
  const store = load()
  store[videoId] = Math.min(Math.max(0, Math.round(progress)), 100)
  localStorage.setItem(KEY, JSON.stringify(store))
}
