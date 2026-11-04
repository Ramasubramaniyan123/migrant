import { cn } from '@/lib/cn'

export function Avatar({ src, name, size = 'md' }: { src: string; name: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  return (
    <img
      src={src}
      alt={name}
      className={cn(
        'rounded-full object-cover ring-2 ring-white',
        size === 'sm' && 'h-8 w-8',
        size === 'md' && 'h-11 w-11',
        size === 'lg' && 'h-16 w-16',
        size === 'xl' && 'h-24 w-24',
      )}
    />
  )
}
