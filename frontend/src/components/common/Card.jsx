const Card = ({ children, className = '', hover = false, padding = true }) => {
  const baseStyles = 'bg-white rounded-card shadow-card';
  const hoverStyles = hover ? 'transition-all duration-200 hover:shadow-elevated hover:-translate-y-1 cursor-pointer' : '';
  const paddingStyles = padding ? 'p-6' : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${paddingStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
