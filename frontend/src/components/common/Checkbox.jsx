import { forwardRef } from 'react';

const Checkbox = forwardRef(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div>
      <label className="flex items-center cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className={`w-4 h-4 text-terracotta border-gray-300 rounded focus:ring-terracotta focus:ring-2 cursor-pointer ${className}`}
          {...props}
        />
        {label && <span className="ml-2 text-sm text-charcoal">{label}</span>}
      </label>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
