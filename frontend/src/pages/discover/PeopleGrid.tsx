import React from 'react';
import { UserCard } from '@/components/shared/UserCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Users } from 'lucide-react';
import type { User } from '@/types';

interface PeopleGridProps {
  users: User[];
  onConnect?: (userId: string) => void;
  onAccept?: (userId: string) => void;
  onReject?: (userId: string) => void;
}

export const PeopleGrid: React.FC<PeopleGridProps> = ({
  users,
  onConnect,
  onAccept,
  onReject,
}) => {
  if (users.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-12 h-12 text-gray-400" />}
        title="No Migrant Members Found"
        description="Try adjusting your mother tongue, hometown, or distance filters to expand the search radius."
        className="bg-white rounded-2xl border border-gray-200 p-12"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onConnect={onConnect}
          onAccept={onAccept}
          onReject={onReject}
        />
      ))}
    </div>
  );
};
