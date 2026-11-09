import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-terracotta text-white hover:bg-terracotta-dark focus:ring-terracotta active:scale-95',
    secondary: 'bg-navy text-white hover:bg-navy-dark focus:ring-navy active:scale-95',
    outline: 'border-2 border-navy text-navy hover:bg-navy hover:text-white focus:ring-navy active:scale-95',
    ghost: 'text-navy hover:bg-lavender focus:ring-lavender active:scale-95',
    danger: 'bg-error text-white hover:bg-red-600 focus:ring-error active:scale-95',
    success: 'bg-success text-white hover:bg-green-700 focus:ring-success active:scale-95',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

export default Button;
