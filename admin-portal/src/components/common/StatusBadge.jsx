import { cn } from '@/utils/helpers';
const TONES = {
  gray: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  red: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
  cyan: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300'
};
export default function StatusBadge({
  tone = 'gray',
  children,
  className,
  dot = false
}) {
  return <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', TONES[tone], className)}>
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" /> : null}
      {children}
    </span>;
}

/** Convenience: maps common status strings to tones + labels. */
export function statusTone(status) {
  switch (status) {
    case 'ACTIVE':
    case 'RESOLVED':
    case 'COMPLETED':
    case 'ATTENDED':
    case 'SUCCESS':
      return 'green';
    case 'PENDING':
    case 'UNDER_REVIEW':
    case 'INVITED':
    case 'UPCOMING':
    case 'REGISTERED':
    case 'SCHEDULED':
      return 'amber';
    case 'SUSPENDED':
    case 'DEACTIVATED':
    case 'CANCELLED':
    case 'FAILURE':
    case 'CRITICAL':
      return 'red';
    case 'DENIED':
      return 'purple';
    case 'ONGOING':
      return 'blue';
    default:
      return 'gray';
  }
}
export function statusLabel(status) {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}
