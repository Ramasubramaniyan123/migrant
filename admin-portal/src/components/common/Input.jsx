import { forwardRef } from 'react';
import { cn } from '@/utils/helpers';
export const Input = forwardRef(function Input({
  label,
  error,
  hint,
  id,
  className,
  ...rest
}, ref) {
  const inputId = id ?? rest.name;
  return <div className="w-full">
      {label ? <label htmlFor={inputId} className="label">
          {label}
        </label> : null}
      <input ref={ref} id={inputId} className={cn('input', error && 'border-red-400 focus:border-red-500 focus:ring-red-100', className)} {...rest} />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
      {!error && hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>;
});
export const Textarea = forwardRef(function Textarea({
  label,
  error,
  id,
  className,
  ...rest
}, ref) {
  const inputId = id ?? rest.name;
  return <div className="w-full">
      {label ? <label htmlFor={inputId} className="label">
          {label}
        </label> : null}
      <textarea ref={ref} id={inputId} className={cn('input min-h-[100px] py-2', error && 'border-red-400 focus:border-red-500 focus:ring-red-100', className)} {...rest} />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>;
});
export function Select({
  label,
  error,
  id,
  className,
  children,
  ...rest
}) {
  const inputId = id ?? rest.name;
  return <div className="w-full">
      {label ? <label htmlFor={inputId} className="label">
          {label}
        </label> : null}
      <select id={inputId} className={cn('input', error && 'border-red-400', className)} {...rest}>
        {children}
      </select>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>;
}
