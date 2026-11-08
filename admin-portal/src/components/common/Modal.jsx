import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/helpers';
const SIZE_CLASSES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl'
};
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md'
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label={title} className={cn('relative w-full rounded-xl bg-white shadow-xl dark:bg-slate-900', SIZE_CLASSES[size])}>
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            {description ? <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
          </div>
          <button onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4 dark:text-slate-200">{children}</div>
        {footer ? <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
            {footer}
          </div> : null}
      </div>
    </div>;
}
