import { cn } from '@/utils/helpers';
/** Search input with a magnifier icon and an optional submit handler. */
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  onSubmit,
  className
}) {
  const handleSubmit = event => {
    event.preventDefault();
    onSubmit?.();
  };
  return <form role="search" onSubmit={handleSubmit} className={cn('relative', className)}>
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3" />
        </svg>
      </span>
      <input type="search" value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus-visible:outline-none" />
    </form>;
}
