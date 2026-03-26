export const formatDuration = (isoDuration: string | undefined): string => {
  if (!isoDuration) return '0:00'

  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '0:00'

  const hours = parseInt(match[1] ?? '0', 10) || 0
  const minutes = parseInt(match[2] ?? '0', 10) || 0
  const seconds = parseInt(match[3] ?? '0', 10) || 0

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
