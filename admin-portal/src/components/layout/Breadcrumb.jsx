import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/helpers';
export default function Breadcrumb({
  items,
  className
}) {
  return <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm', className)}>
      {items.map((item, i) => {
      const isLast = i === items.length - 1;
      return <Fragment key={`${item.label}-${i}`}>
            {i > 0 ? <ChevronRight className="h-3.5 w-3.5 text-slate-400" /> : null}
            {item.to && !isLast ? <Link to={item.to} className="text-slate-500 hover:text-blue-600 dark:text-slate-400">
                {item.label}
              </Link> : <span className={cn(isLast ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-500')}>
                {item.label}
              </span>}
          </Fragment>;
    })}
    </nav>;
}
