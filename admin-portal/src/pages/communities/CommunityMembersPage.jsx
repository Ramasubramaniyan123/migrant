import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Loader from '@/components/common/Loader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { communityService } from '@/services/communityService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';

const ROLE_TONES = { ADMIN: 'purple', MODERATOR: 'blue', MEMBER: 'gray' };

export default function CommunityMembersPage() {
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
      setError(err?.message ?? 'Failed to load members');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const columns = [
    { key: 'user', header: 'Member', render: m => <span className="font-medium text-slate-900">{m.userName}</span> },
    { key: 'userId', header: 'User ID', render: m => <span className="text-slate-500">{m.userId}</span> },
    {
      key: 'role',
      header: 'Role',
      render: m => <StatusBadge tone={ROLE_TONES[m.role] ?? 'gray'}>{m.role}</StatusBadge>
    },
    { key: 'joined', header: 'Joined', render: m => formatDate(m.joinedAt) }
  ];

  return (
    <div>
      <PageHeader
        title={community ? `${community.name} — Members` : 'Community members'}
        description="Members of this community."
        breadcrumbs={[
          { label: 'Communities', to: ADMIN_ROUTES.communities },
          { label: community?.name ?? 'Community', to: community ? ADMIN_ROUTES.communityDetails(community.id) : undefined },
          { label: 'Members' }
        ]}
      />

      {isLoading ? (
        <Loader label="Loading members…" />
      ) : (
        <div className="card overflow-hidden">
          <DataTable
            columns={columns}
            rows={members}
            rowKey={m => m.id}
            error={error}
            emptyTitle="No members"
            emptyDescription="This community does not have any members yet."
          />
        </div>
      )}
    </div>
  );
}
