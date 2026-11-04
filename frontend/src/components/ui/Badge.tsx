import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Badge({ children, tone = 'soft' }: { children: ReactNode; tone?: 'soft' | 'accent' | 'line' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        tone === 'soft' && 'bg-brand-soft text-brand',
        tone === 'accent' && 'bg-accent-soft text-[#c56a20]',
        tone === 'line' && 'border border-line text-muted',
      )}
    >
      {children}
    </span>
  )
}
