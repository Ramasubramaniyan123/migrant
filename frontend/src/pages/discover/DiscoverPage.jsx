import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { messageService } from '@/services/messageService';
import { useAuth } from '@/hooks/useAuth';
import { useConnections } from '@/hooks/useConnections';
import { useDiscovery } from '@/hooks/useDiscovery';
import { ROUTES } from '@/utils/constants';
import Button from '@/components/common/Button';
import DiscoveryFilters from './DiscoveryFilters';
import NearbyMap from './NearbyMap';
import PeopleGrid from './PeopleGrid';
const NEARBY_RADIUS_KM = 25;

/** People discovery screen: filters, result grid and a proximity overview. */
export default function DiscoverPage() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    filters,
    results,
    isLoading,
    error,
    setFilters,
    resetFilters
  } = useDiscovery();
  const {
    sendRequest
  } = useConnections();
  const [busyId, setBusyId] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const userId = user?.id;
  const handleConnect = useCallback(async target => {
    setBusyId(target.id);
    try {
      await sendRequest(target.id, target.matchScore, target.matchReason);
    } finally {
      setBusyId(null);
    }
  }, [sendRequest]);
  const handleMessage = useCallback(async target => {
    if (!userId) return;
    const conversation = await messageService.getOrCreateConversation(userId, target.id);
    navigate(`${ROUTES.messages}/${conversation.id}`);
  }, [navigate, userId]);
  const nearby = results.filter(person => person.distanceKm !== undefined && person.distanceKm <= NEARBY_RADIUS_KM);
  return <div className="mx-auto w-full max-w-6xl space-y-6">
      <header>
        <h1 className="page-title">Discover people</h1>
        <p className="muted mt-1">
          {isLoading ? 'Searching…' : `${results.length} people match your filters`}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <DiscoveryFilters filters={filters} onChange={patch => setFilters(current => ({
          ...current,
          ...patch
        }))} onReset={resetFilters} />
        </aside>

        <div className="space-y-6">
          {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div> : null}

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Matches</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowMap(open => !open)}>
              {showMap ? 'Hide map' : 'Show map'}
            </Button>
          </div>

          {showMap ? <NearbyMap people={nearby} radiusKm={NEARBY_RADIUS_KM} activeUserId={busyId ?? undefined} onSelect={person => navigate(ROUTES.userProfile(person.id))} /> : null}

          <PeopleGrid users={results} isLoading={isLoading} busyId={busyId} onConnect={person => void handleConnect(person)} onMessage={person => void handleMessage(person)} onViewProfile={person => navigate(ROUTES.userProfile(person.id))} />
        </div>
      </div>
    </div>;
}
