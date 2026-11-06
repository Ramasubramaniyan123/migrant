import { useEffect, useState } from 'react'
import { cn } from '@/utils/helpers'
import { getInitials } from '@/utils/formatters'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  name: string
  src?: string
  size?: AvatarSize
  className?: string
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
}

const PALETTE = [
  'bg-brand-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-cyan-500',
  'bg-indigo-500',
]

/** Stable palette index so the same name always gets the same fallback colour. */
function colorFor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

/** User avatar that falls back to deterministic initials when no image is available. */
export default function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setHasError(true)}
        className={cn('rounded-full object-cover', SIZE_CLASSES[size], className)}
      />
    )
  }

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold text-white',
        colorFor(name),
        SIZE_CLASSES[size],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  )
}
