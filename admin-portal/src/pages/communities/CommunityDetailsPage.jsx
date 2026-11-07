import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Edit3, Users } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { communityService } from '@/services/communityService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';
import { formatNumber } from '@/utils/helpers';
import CommunityAnalytics from './CommunityAnalytics';

const TYPE_TONES = { LANGUAGE: 'blue', HOMETOWN: 'green', INTEREST: 'amber', WORKPLACE: 'purple' };

function StatCard({ label, value }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function CommunityDetailsPage() {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [c, m] = await Promise.all([communityService.getById(id), communityService.listMembers(id)]);
      setCommunity(c);
      setMembers(m);
    } catch (err) {
      setError(err?.message ?? 'Failed to load community');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (isLoading) return <Loader label="Loading community…" />;

  if (error || !community) {
    return (
      <div>
        <PageHeader title="Community not found" />
        <EmptyState
          title="Community not found"
          description={error ?? 'The requested community does not exist.'}
          action={
            <Link to={ADMIN_ROUTES.communities}>
              <Button variant="secondary">Back to communities</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const memberColumns = [
    { key: 'user', header: 'Member', render: m => <span className="font-medium text-slate-900">{m.userName}</span> },
    { key: 'role', header: 'Role', render: m => <StatusBadge tone={m.role === 'ADMIN' ? 'purple' : 'gray'}>{m.role}</StatusBadge> },
    { key: 'joined', header: 'Joined', render: m => formatDate(m.joinedAt) }
  ];

  return (
    <div>
      <PageHeader
        title={community.name}
        description={community.description}
        breadcrumbs={[
          { label: 'Communities', to: ADMIN_ROUTES.communities },
          { label: community.name }
        ]}
        actions={
          <>
            <Link to={ADMIN_ROUTES.communityMembers(community.id)}>
              <Button variant="secondary" leftIcon={<Users className="h-4 w-4" />}>Members</Button>
            </Link>
            <Link to={ADMIN_ROUTES.editCommunity(community.id)}>
              <Button leftIcon={<Edit3 className="h-4 w-4" />}>Edit</Button>
            </Link>
          </>
        }
      />

      <div className="card mb-6 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone={TYPE_TONES[community.type] ?? 'gray'}>{community.type}</StatusBadge>
          {community.language ? <StatusBadge tone="cyan">{community.language}</StatusBadge> : null}
          {community.hometown ? <StatusBadge tone="green">{community.hometown}</StatusBadge> : null}
          <StatusBadge tone={community.isActive ? 'green' : 'gray'} dot>
            {community.isActive ? 'Active' : 'Inactive'}
          </StatusBadge>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Members" value={formatNumber(community.memberCount ?? 0)} />
          <StatCard label="Posts" value={formatNumber(community.postCount ?? 0)} />
          <StatCard label="City" value={community.city ?? '—'} />
          <StatCard label="Created" value={community.createdAt ? formatDate(community.createdAt) : '—'} />
        </div>
      </div>

      <CommunityAnalytics />

      <div className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">Members</h2>
          <Link to={ADMIN_ROUTES.communityMembers(community.id)} className="text-sm font-medium text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        <DataTable
          columns={memberColumns}
          rows={members.slice(0, 5)}
          rowKey={m => m.id}
          emptyTitle="No members yet"
          emptyDescription="This community does not have any members."
        />
      </div>
    </div>
  );
}
