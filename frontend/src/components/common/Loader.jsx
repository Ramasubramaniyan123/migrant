import { cn } from '@/utils/helpers';
const SIZE_CLASSES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-4'
};

/** Spinner with an optional label, usable inline or as a full-screen overlay. */
export default function Loader({
  size = 'md',
  label,
  fullScreen = false,
  className
}) {
  const spinner = <div role="status" aria-live="polite" className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <span className={cn('inline-block animate-spin-slow rounded-full border-brand-200 border-t-brand-600', SIZE_CLASSES[size])} aria-hidden="true" />
      {label ? <span className="text-sm text-slate-500">{label}</span> : null}
    </div>;
  if (fullScreen) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>;
  }
  return spinner;
}
