import Breadcrumb from './Breadcrumb';
import { cn } from '@/utils/helpers';
export default function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className
}) {
  return <div className={cn('mb-6', className)}>
      {breadcrumbs && breadcrumbs.length > 0 ? <Breadcrumb items={breadcrumbs} className="mb-2" /> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
          {description ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </div>;
}
