import React from 'react';
import { clsx } from '@/utils/helpers';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseStyles = 'bg-gray-200';

  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animations = {
    pulse: 'animate-pulse',
    wave: 'shimmer',
    none: '',
  };

  return (
    <div
      className={clsx(baseStyles, variants[variant], animations[animation], className)}
      style={{ width, height }}
      role="status"
      aria-label="Loading..."
    />
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
    <div className="flex items-center space-x-3">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton width="60%" height={16} />
        <Skeleton width="40%" height={12} />
      </div>
    </div>
    <Skeleton variant="rounded" height={80} />
    <div className="flex items-center justify-between">
      <Skeleton width={80} height={16} />
      <Skeleton width={60} height={16} />
    </div>
  </div>
);

export const PostSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="space-y-2">
          <Skeleton width={120} height={16} />
          <Skeleton width={100} height={12} />
        </div>
      </div>
      <Skeleton width={60} height={24} variant="rounded" />
    </div>
    <Skeleton variant="rounded" height={16} width="100%" />
    <Skeleton variant="rounded" height={16} width="80%" />
    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
      <Skeleton width={80} height={16} />
      <Skeleton width={80} height={16} />
    </div>
  </div>
);

export const UserCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
    <div className="flex items-center space-x-3">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton width={100} height={16} />
        <Skeleton width={80} height={12} />
      </div>
    </div>
    <Skeleton variant="rounded" height={32} width="100%" />
  </div>
);

export const CommunityCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton width={120} height={20} />
      <Skeleton width={50} height={20} variant="rounded" />
    </div>
    <Skeleton variant="rounded" height={12} width="100%" />
    <Skeleton variant="rounded" height={12} width="70%" />
    <Skeleton width={60} height={12} />
  </div>
);
