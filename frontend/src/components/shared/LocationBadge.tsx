import React from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import type { IndianLocation } from '@/types';

interface LocationBadgeProps {
  location?: IndianLocation | { city: string; state?: string; country?: string } | string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

export const LocationBadge: React.FC<LocationBadgeProps> = ({
  location,
  variant = 'secondary',
  size = 'md',
  className,
}) => {
  if (!location) return null;

  const text = typeof location === 'string'
    ? location
    : [location.city, (location as { locality?: string }).locality, (location as { state?: string }).state || (location as { country?: string }).country]
        .filter(Boolean)
        .slice(0, 2)
        .join(', ');

  return (
    <Badge variant={variant} size={size} className={className}>
      <MapPin className="w-3 h-3 mr-1 inline shrink-0" />
      <span>{text}</span>
    </Badge>
  );
};
