import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useConnections } from '@/hooks/useConnections';
import { useUsers } from '@/hooks/useUsers';
import { fullName } from '@/services/userService';
import { MATCH_REASON_LABELS, ROUTES } from '@/utils/constants';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';

/** Outgoing pending connection requests with a cancel action. */
export default function SentRequests() {
  const {
    sentRequests,
    isLoading,
    cancel
  } = useConnections();
  const {
    getUserById
  } = useUsers();
  const [busyId, setBusyId] = useState(null);
  const handleCancel = async connectionId => {
    setBusyId(connectionId);
    try {
      await cancel(connectionId);
    } finally {
      setBusyId(null);
    }
  };
  if (isLoading) {
    return <Loader label="Loading requests…" />;
  }
  if (sentRequests.length === 0) {
    return <EmptyState title="No sent requests" description="You haven't sent any connection requests yet." />;
  }
  return <div className="space-y-3">
      {sentRequests.map(connection => {
      const receiver = getUserById(connection.receiverId);
      const name = receiver ? fullName(receiver) : 'Unknown member';
      return <div key={connection.id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Avatar name={name} src={receiver?.profile.avatarUrl} size="lg" />
              <div className="min-w-0">
                <Link to={ROUTES.userProfile(connection.receiverId)} className="text-sm font-semibold text-slate-900 hover:underline">
                  {name}
                </Link>
                <p className="text-xs text-slate-500">Request pending</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant="neutral" size="sm">
                    {MATCH_REASON_LABELS[connection.matchedBy]}
                  </Badge>
                  <span className="text-xs font-medium text-slate-500">{connection.matchScore}% match</span>
                </div>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => void handleCancel(connection.id)} isLoading={busyId === connection.id}>
              Cancel request
            </Button>
          </div>;
    })}
    </div>;
}
