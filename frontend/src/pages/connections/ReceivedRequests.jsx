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

/** Incoming pending connection requests with accept / decline actions. */
export default function ReceivedRequests() {
  const {
    receivedRequests,
    isLoading,
    accept,
    reject
  } = useConnections();
  const {
    getUserById
  } = useUsers();
  const [busyId, setBusyId] = useState(null);
  const handleAction = async (connectionId, action) => {
    setBusyId(connectionId);
    try {
      await action(connectionId);
    } finally {
      setBusyId(null);
    }
  };
  if (isLoading) {
    return <Loader label="Loading requests…" />;
  }
  if (receivedRequests.length === 0) {
    return <EmptyState title="No pending requests" description="When someone asks to connect, their request will appear here." />;
  }
  return <div className="space-y-3">
      {receivedRequests.map(connection => {
      const requester = getUserById(connection.requesterId);
      const name = requester ? fullName(requester) : 'Unknown member';
      return <div key={connection.id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Avatar name={name} src={requester?.profile.avatarUrl} size="lg" />
              <div className="min-w-0">
                <Link to={ROUTES.userProfile(connection.requesterId)} className="text-sm font-semibold text-slate-900 hover:underline">
                  {name}
                </Link>
                {(requester?.profile.hometownCity || requester?.profile.hometownCountry) && <p className="text-xs text-slate-500">
                    From {[requester?.profile.hometownCity, requester?.profile.hometownCountry].filter(Boolean).join(', ')}
                  </p>}
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant="brand" size="sm">
                    {MATCH_REASON_LABELS[connection.matchedBy]}
                  </Badge>
                  <span className="text-xs font-medium text-slate-500">{connection.matchScore}% match</span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button size="sm" onClick={() => void handleAction(connection.id, accept)} isLoading={busyId === connection.id}>
                Accept
              </Button>
              <Button size="sm" variant="ghost" onClick={() => void handleAction(connection.id, reject)} disabled={busyId === connection.id}>
                Decline
              </Button>
            </div>
          </div>;
    })}
    </div>;
}
