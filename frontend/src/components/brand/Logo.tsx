import { cn } from '@/lib/cn'

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
        <span className="absolute left-1.5 h-3 w-3 rounded-full bg-white" />
        <span className="absolute right-1.5 h-3 w-3 rounded-full bg-brand-soft" />
      </span>
      <span className={cn('text-lg font-bold tracking-tight', light ? 'text-white' : 'text-ink')}>Connect</span>
    </span>
  )
}
