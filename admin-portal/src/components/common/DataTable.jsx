import { cn } from '@/utils/helpers';
import Loader from './Loader';
import EmptyState from './EmptyState';
export default function DataTable({
  columns,
  rows,
  rowKey,
  isLoading = false,
  error = null,
  emptyTitle = 'No records found',
  emptyDescription,
  emptyAction,
  onRowClick,
  className
}) {
  if (isLoading) {
    return <Loader label="Loading records…" />;
  }
  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
        {error}
      </div>;
  }
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }
  return <div className={cn('overflow-x-auto', className)}>
      <table className="data-table w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
            {columns.map(col => <th key={col.key} className={cn('th', col.className)}>
                {col.header}
              </th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map(row => <tr key={rowKey(row)} onClick={onRowClick ? () => onRowClick(row) : undefined} className={cn(onRowClick && 'cursor-pointer')}>
              {columns.map(col => <td key={col.key} className={cn('td', col.className)}>
                  {col.render(row)}
                </td>)}
            </tr>)}
        </tbody>
      </table>
    </div>;
}
