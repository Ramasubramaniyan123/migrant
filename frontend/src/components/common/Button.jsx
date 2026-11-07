import { cn } from '@/utils/helpers';
const VARIANT_CLASSES = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
  secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:active:bg-slate-600',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
};
const SIZE_CLASSES = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base'
};

/** Primary interactive button supporting variants, sizes and a built-in loading state. */
export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  type = 'button',
  disabled,
  className,
  children,
  ...rest
}) {
  return <button {...rest} type={type} disabled={disabled || isLoading} aria-busy={isLoading || undefined} className={cn('inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors', 'focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60', VARIANT_CLASSES[variant], SIZE_CLASSES[size], fullWidth && 'w-full', className)}>
      {isLoading ? <span className="inline-block h-4 w-4 animate-spin-slow rounded-full border-2 border-current border-t-transparent" aria-hidden="true" /> : null}
      {children}
    </button>;
}
