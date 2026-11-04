import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, UserX, Compass, MapPin } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import type { Connection } from '@/types';

interface MyConnectionsProps {
  connections: Connection[];
  onRemove: (id: string) => void;
}

export const MyConnections: React.FC<MyConnectionsProps> = ({
  connections,
  onRemove,
}) => {
  if (connections.length === 0) {
    return (
      <EmptyState
        title="No Connections Yet"
        description="Discover people who share your language, hometown, or workplace in Gurugram and send a connection request!"
        className="bg-white rounded-2xl border border-gray-200 p-12"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {connections.map((conn) => {
        const u = conn.user;
        const targetId = conn.userId || conn.receiverId || conn.requesterId;
        return (
          <div
            key={conn.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-sm hover:border-indigo-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <Link to={`/profile/${targetId}`} className="flex items-center space-x-3 group min-w-0">
                  <Avatar
                    src={u?.avatar}
                    name={u?.fullName || 'User'}
                    size="lg"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors truncate">
                      {u?.fullName}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">{u?.profession}</p>
                  </div>
                </Link>
                {u?.motherTongue && (
                  <Badge variant="primary" size="sm" className="text-[10px] shrink-0">
                    {u.motherTongue}
                  </Badge>
                )}
              </div>

              <div className="mt-4 space-y-1 text-xs text-gray-500">
                {u?.hometown && (
                  <div className="flex items-center">
                    <Compass className="w-3.5 h-3.5 mr-1 text-indigo-500 shrink-0" />
                    <span className="truncate">From {u.hometown}</span>
                  </div>
                )}
                {u?.approximateDistance && (
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-500 shrink-0" />
                    <span>{u.approximateDistance}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
              <Link to="/messages">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs py-1 px-3">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Chat
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Remove connection with ${u?.fullName}?`)) {
                    onRemove(conn.id);
                  }
                }}
                className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                title="Remove Connection"
              >
                <UserX className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

