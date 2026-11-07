import { cn } from '@/utils/helpers';
const VARIANT_CLASSES = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger: 'bg-red-50 text-red-700 ring-red-200',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-200'
};
const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs'
};

/** Small rounded label used for statuses, tags and counts. */
export default function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  className
}) {
  return <span className={cn('inline-flex items-center gap-1 rounded-full font-medium ring-1 ring-inset', VARIANT_CLASSES[variant], SIZE_CLASSES[size], className)}>
      {children}
    </span>;
}
