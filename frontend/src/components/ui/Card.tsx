import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'react'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-2xl border border-line bg-card shadow-[0_8px_24px_rgba(32,41,56,0.06)]', className)} {...props} />
}
