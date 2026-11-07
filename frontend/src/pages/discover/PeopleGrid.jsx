import { useConnections } from '@/hooks/useConnections';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';
import UserCard from '@/components/shared/UserCard';
/** Responsive grid of matched people with connect / message actions. */
export default function PeopleGrid({
  users,
  isLoading,
  busyId,
  onConnect,
  onMessage,
  onViewProfile
}) {
  const {
    getStatus
  } = useConnections();
  if (isLoading) {
    return <Loader label="Finding people…" />;
  }
  if (users.length === 0) {
    return <EmptyState title="No matches found" description="Try widening your filters or removing a few interests." />;
  }
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {users.map(person => <UserCard key={person.id} user={person} matchReason={person.matchReason} connectionStatus={getStatus(person.id)} onSendRequest={() => onConnect(person)} onMessage={() => onMessage(person)} onViewProfile={() => onViewProfile(person)} isBusy={busyId === person.id} />)}
    </div>;
}
