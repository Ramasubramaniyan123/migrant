import React from 'react';
import { Check, X, Compass, MapPin } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import type { Connection } from '@/types';

interface ReceivedRequestsProps {
  requests: Connection[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export const ReceivedRequests: React.FC<ReceivedRequestsProps> = ({
  requests,
  onAccept,
  onReject,
}) => {
  if (requests.length === 0) {
    return (
      <EmptyState
        title="No Pending Received Requests"
        description="When other migrants in Gurugram send you connection requests, they will appear here."
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
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start space-x-4 min-w-0">
              <Avatar
                src={u?.avatar}
                name={u?.fullName || 'User'}
                size="lg"
                className="shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{u?.fullName}</h4>
                  {u?.motherTongue && (
                    <Badge variant="primary" size="sm" className="text-[10px]">
                      {u.motherTongue}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{u?.profession}</p>

                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
                  {u?.hometown && (
                    <span className="flex items-center">
                      <Compass className="w-3 h-3 mr-1 text-indigo-500" />
                      From {u.hometown}
                    </span>
                  )}
                  {u?.approximateDistance && (
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-emerald-500" />
                      {u.approximateDistance}
                    </span>
                  )}
                </div>

                {req.message && (
                  <p className="mt-2 text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100 italic">
                    "{req.message}"
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
              <Button
                size="sm"
                onClick={() => onAccept(req.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-xs px-3.5"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(req.id)}
                className="text-xs text-gray-600 hover:text-red-600 px-3"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Decline
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

