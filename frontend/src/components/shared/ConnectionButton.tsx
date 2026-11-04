import React from 'react';
import { UserPlus, Check, X, CheckCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { clsx } from '@/utils/helpers';

export interface ConnectionButtonProps {
  status?: 'none' | 'not-connected' | 'pending' | 'pending-sent' | 'pending-received' | 'accepted' | 'connected' | 'rejected';
  onConnect?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  onRemove?: () => void;
  className?: string;
}

export const ConnectionButton: React.FC<ConnectionButtonProps> = ({
  status = 'none',
  onConnect,
  onAccept,
  onReject,
  onCancel,
  onRemove,
  className,
}) => {
  if (status === 'accepted' || status === 'connected') {
    return (
      <div className={clsx('flex items-center space-x-2', className)}>
        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
          <CheckCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          Connected
        </span>
        {onRemove && (
          <Button variant="ghost" size="sm" onClick={onRemove} className="text-gray-400 hover:text-red-600 text-xs py-1 px-2">
            Remove
          </Button>
        )}
      </div>
    );
  }

  if (status === 'pending-received') {
    return (
      <div className={clsx('flex items-center space-x-1.5', className)}>
        <Button variant="primary" size="sm" onClick={onAccept} className="text-xs bg-emerald-600 hover:bg-emerald-700">
          <Check className="w-3.5 h-3.5 mr-1" />
          Accept
        </Button>
        <Button variant="outline" size="sm" onClick={onReject} className="text-xs text-red-600 border-red-200 hover:bg-red-50">
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>
    );
  }

  if (status === 'pending' || status === 'pending-sent') {
    return (
      <div className={clsx('flex items-center space-x-2', className)}>
        <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1 font-medium">
          Requested
        </span>
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-xs text-gray-400 hover:text-gray-600 px-1.5 py-0.5">
            Cancel
          </Button>
        )}
      </div>
    );
  }

  return (
    <Button variant="primary" size="sm" onClick={onConnect} className={clsx('text-xs', className)}>
      <UserPlus className="w-3.5 h-3.5 mr-1.5" />
      Connect
    </Button>
  );
};
