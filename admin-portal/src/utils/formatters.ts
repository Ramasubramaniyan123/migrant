const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function formatDate(value: string | Date): string {
  return dateFormatter.format(new Date(value))
}

export function formatDateTime(value: string | Date): string {
  return dateTimeFormatter.format(new Date(value))
}

/** e.g. "3 hours ago", "2 days ago" */
export function formatRelativeTime(value: string | Date): string {
  const diffMs = new Date(value).getTime() - Date.now()
  const absMinutes = Math.round(Math.abs(diffMs) / 60000)
  if (absMinutes < 1) return 'just now'
  if (absMinutes < 60) return relativeFormatter.format(Math.round(diffMs / 60000), 'minute')
  const hours = Math.round(diffMs / 3600000)
  if (Math.abs(hours) < 24) return relativeFormatter.format(hours, 'hour')
  const days = Math.round(diffMs / 86400000)
  if (Math.abs(days) < 30) return relativeFormatter.format(days, 'day')
  const months = Math.round(diffMs / 2592000000)
  return relativeFormatter.format(months, 'month')
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
