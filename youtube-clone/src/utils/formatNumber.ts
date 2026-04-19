export const formatNumber = (value: number | string | undefined | null): string => {
  const num = Number(value)
  if (!value || isNaN(num)) return '0'
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace('.0', '') + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace('.0', '') + 'K'
  return String(num)
}
