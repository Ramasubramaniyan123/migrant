import { cn } from '@/utils/helpers';
import { formatNumber } from '@/utils/helpers';
export default function StatCard({
  label,
  value,
  icon,
  hint,
  trend,
  className
}) {
  return <div className={cn('card flex items-start justify-between p-5', className)}>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {typeof value === 'number' ? formatNumber(value) : value}
        </p>
        {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
        {trend ? <p className={cn('mt-1 text-xs font-medium', trend.positive === false ? 'text-red-600' : 'text-emerald-600')}>
            {trend.value}
          </p> : null}
      </div>
      {icon ? <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          {icon}
        </div> : null}
    </div>;
}
