export const timeAgo = (iso) => {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diff = Date.now() - then
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

export const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : '')
export const formatDateTime = (iso) => (iso ? new Date(iso).toLocaleString() : '')

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

/** Derives a display name from an email local part, e.g. john.doe@x.com -> "John Doe". */
export const displayNameFromEmail = (email) => {
  if (!email) return ''
  const local = email.split('@')[0] || ''
  const parts = local.split(/[._\-+\d]+/).filter(Boolean)
  if (parts.length === 0) return capitalize(local)
  return parts.map(capitalize).join(' ')
}
