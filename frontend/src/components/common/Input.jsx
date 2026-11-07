import { useId } from 'react';
import { cn } from '@/utils/helpers';
const FIELD_BASE = 'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500';

/** Single-line text field with label, hint and inline validation message. */
export default function Input({
  label,
  error,
  hint,
  id,
  className,
  ...rest
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedById = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  return <div className="flex flex-col gap-1.5">
      {label ? <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label> : null}
      <input {...rest} id={inputId} aria-invalid={error ? true : undefined} aria-describedby={describedById} className={cn(FIELD_BASE, error ? 'border-red-400 focus:border-red-500 focus-visible:ring-red-500' : 'border-slate-300 focus:border-brand-500 focus-visible:ring-brand-500 dark:border-slate-700 dark:focus:border-brand-400', className)} />
      {error ? <p id={`${inputId}-error`} className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p> : hint ? <p id={`${inputId}-hint`} className="text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p> : null}
    </div>;
}

/** Multi-line text field matching the `Input` styling. */
export function Textarea({
  label,
  error,
  hint,
  id,
  className,
  rows = 4,
  ...rest
}) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const describedById = error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined;
  return <div className="flex flex-col gap-1.5">
      {label ? <label htmlFor={textareaId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label> : null}
      <textarea {...rest} id={textareaId} rows={rows} aria-invalid={error ? true : undefined} aria-describedby={describedById} className={cn(FIELD_BASE, 'resize-y', error ? 'border-red-400 focus:border-red-500 focus-visible:ring-red-500' : 'border-slate-300 focus:border-brand-500 focus-visible:ring-brand-500 dark:border-slate-700 dark:focus:border-brand-400', className)} />
      {error ? <p id={`${textareaId}-error`} className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p> : hint ? <p id={`${textareaId}-hint`} className="text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p> : null}
    </div>;
}
