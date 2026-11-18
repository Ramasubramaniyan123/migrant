const PALETTE = [
  'bg-accent-soft text-accent',
  'bg-info/10 text-info',
  'bg-success/10 text-success',
  'bg-warning/10 text-warning',
]

export const Avatar = ({ name = '', src, size = 'md', className = '' }) => {
  const initials = (name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '?'

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  }

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover flex-shrink-0 ${className}`}
      />
    )
  }

  const palette = PALETTE[(name || '').length % PALETTE.length]
  return (
    <span
      aria-hidden="true"
      className={`${sizes[size]} rounded-full ${palette} font-semibold flex items-center justify-center flex-shrink-0 ${className}`}
    >
      {initials}
    </span>
  )
}
