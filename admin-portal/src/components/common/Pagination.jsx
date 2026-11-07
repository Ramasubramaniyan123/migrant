import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/helpers';
import Button from './Button';
export default function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  itemLabel = 'records'
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const pages = buildPageList(page, totalPages);
  return <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row dark:border-slate-700">
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-700 dark:text-slate-300">{from}–{to}</span> of{' '}
        <span className="font-medium text-slate-700 dark:text-slate-300">{total}</span> {itemLabel}
      </p>

      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pages.map((p, i) => p === '…' ? <span key={`ellipsis-${i}`} className="px-2 text-sm text-slate-400">
              …
            </span> : <button key={p} onClick={() => onPageChange(p)} className={cn('h-8 min-w-8 rounded-lg px-2 text-sm font-medium transition-colors', p === page ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800')} aria-current={p === page ? 'page' : undefined}>
              {p}
            </button>)}
        <Button variant="ghost" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {onPageSizeChange ? <select value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))} className="input h-8 w-auto text-xs" aria-label="Rows per page">
          {[10, 20, 50].map(s => <option key={s} value={s}>
              {s} / page
            </option>)}
        </select> : null}
    </div>;
}
function buildPageList(page, total) {
  if (total <= 7) return Array.from({
    length: total
  }, (_, i) => i + 1);
  const pages = new Set([1, total, page - 1, page, page + 1]);
  const sorted = Array.from(pages).filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push('…');
    result.push(p);
    prev = p;
  }
  return result;
}
