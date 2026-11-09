import { User } from 'lucide-react';

const Avatar = ({ 
  src, 
  alt = 'User avatar', 
  size = 'md', 
  online = false,
  className = '' 
}) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizes[size]} rounded-full overflow-hidden bg-lavender flex items-center justify-center`}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <User className={`${iconSizes[size]} text-navy`} />
        )}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 block w-3 h-3 bg-success rounded-full border-2 border-white"></span>
      )}
    </div>
  );
};

export default Avatar;
