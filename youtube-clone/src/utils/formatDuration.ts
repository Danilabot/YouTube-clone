export const parseDurationToSeconds = (isoDuration: string | undefined): number => {
  if (!isoDuration) return 0
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  return (parseInt(match[1] ?? '0') || 0) * 3600
    + (parseInt(match[2] ?? '0') || 0) * 60
    + (parseInt(match[3] ?? '0') || 0)
}

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
