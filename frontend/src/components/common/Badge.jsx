const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '' 
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-charcoal',
    primary: 'bg-terracotta-light text-terracotta-dark',
    success: 'bg-green-100 text-success',
    warning: 'bg-yellow-100 text-warning',
    error: 'bg-red-100 text-error',
    info: 'bg-blue-100 text-blue-700',
    navy: 'bg-navy-light text-navy',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
