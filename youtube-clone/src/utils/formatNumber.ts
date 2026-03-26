export const formatNumber = (value: number | string): string => {
  const num = Number(value)
  if (num > 1_000_000) return Math.floor(num / 1_000_000) + 'M'
  if (num >= 1_000) return Math.floor(num / 1_000) + 'K'
  return String(num)
}
