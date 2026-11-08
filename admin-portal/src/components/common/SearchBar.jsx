import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils/helpers';
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  className,
  debounceMs = 300,
  onDebouncedChange
}) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);
  useEffect(() => {
    if (!onDebouncedChange) return;
    const t = setTimeout(() => onDebouncedChange(local), debounceMs);
    return () => clearTimeout(t);
  }, [local, debounceMs, onDebouncedChange]);
  return <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      <input type="search" value={local} onChange={e => {
      setLocal(e.target.value);
      onChange(e.target.value);
    }} placeholder={placeholder} className="input pl-9 pr-9" aria-label={placeholder} />
      {local ? <button type="button" onClick={() => {
      setLocal('');
      onChange('');
    }} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300" aria-label="Clear search">
          <X className="h-4 w-4" />
        </button> : null}
    </div>;
}
