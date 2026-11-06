import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

const SIZES = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' } as const

export default function Loader({ size = 'md', label = 'Loading…', className }: LoaderProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-10 text-slate-500', className)} role="status">
      <Loader2 className={cn('animate-spin text-blue-600', SIZES[size])} aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
