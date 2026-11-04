import React from 'react';
import { User } from 'lucide-react';
import { clsx } from '@/utils/helpers';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  name,
  className,
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || 'Avatar'}
        className={clsx('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  if (name) {
    return (
      <div
        className={clsx(
          'rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold',
          sizes[size],
          className
        )}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'rounded-full bg-gray-200 text-gray-500 flex items-center justify-center',
        sizes[size],
        className
      )}
    >
      <User className="w-1/2 h-1/2" />
    </div>
  );
};
