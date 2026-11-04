import React from 'react';
import { X, Clock } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import type { Connection } from '@/types';

interface SentRequestsProps {
  requests: Connection[];
  onCancel: (id: string) => void;
}

export const SentRequests: React.FC<SentRequestsProps> = ({
  requests,
  onCancel,
}) => {
  if (requests.length === 0) {
    return (
      <EmptyState
        title="No Sent Requests"
        description="Browse the Discover or Hometown Match sections to find and connect with fellow migrants."
        className="bg-white rounded-2xl border border-gray-200 p-12"
      />
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => {
        const u = req.user;
        return (
          <div
            key={req.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center space-x-4 min-w-0">
              <Avatar
                src={u?.avatar}
                name={u?.fullName || 'User'}
                size="lg"
                className="shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{u?.fullName}</h4>
                  <Badge variant="warning" size="sm" className="text-[10px]">
                    Pending Response
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{u?.profession}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Sent on {new Date(req.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(req.id)}
              className="text-xs text-gray-500 hover:text-red-600 self-end sm:self-center"
            >
              Cancel Request
            </Button>
          </div>
        );
      })}
    </div>
  );
};

