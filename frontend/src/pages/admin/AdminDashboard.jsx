import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { communityService } from '@/services/communityService';
import { fullName } from '@/services/userService';
import { useUsers } from '@/hooks/useUsers';
import { ROUTES } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';

/** Admin overview: platform totals and the newest members. */
export default function AdminDashboard() {
  const {
    users,
    isLoading
  } = useUsers();
  const [communityCount, setCommunityCount] = useState(0);
  const [memberTotal, setMemberTotal] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  useEffect(() => {
    let cancelled = false;
    void communityService.getCommunities().then(rows => {
      if (cancelled) return;
      setCommunityCount(rows.length);
      setMemberTotal(rows.reduce((sum, community) => sum + community.memberCount, 0));
    }).finally(() => {
      if (!cancelled) setIsLoadingStats(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  if (isLoading || isLoadingStats) {
    return <Loader label="Loading admin overview…" />;
  }
  const verified = users.filter(row => row.isVerified).length;
  const admins = users.filter(row => row.role === 'ADMIN').length;
  const stats = [{
    label: 'Total members',
    value: users.length,
    to: ROUTES.adminUsers
  }, {
    label: 'Verified members',
    value: verified,
    to: ROUTES.adminUsers
  }, {
    label: 'Communities',
    value: communityCount,
    to: ROUTES.adminCommunities
  }, {
    label: 'Community memberships',
    value: memberTotal,
    to: ROUTES.adminCommunities
  }];
  const recent = [...users].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 5);
  return <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Admin dashboard</h1>
          <p className="muted mt-1">
            {admins} administrator{admins === 1 ? '' : 's'} · {users.length} members in total
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={ROUTES.adminReports}>
            <Button variant="secondary">Review reports</Button>
          </Link>
          <Link to={ROUTES.adminUsers}>
            <Button>Manage users</Button>
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => <Link key={stat.label} to={stat.to} className="card transition hover:shadow-md">
            <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
            <p className="muted mt-1">{stat.label}</p>
          </Link>)}
      </div>

      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Newest members</h2>
          <Link to={ROUTES.adminUsers} className="text-sm font-medium text-brand-700 hover:underline">
            View all
          </Link>
        </div>

        <ul className="divide-y divide-slate-100">
          {recent.map(member => {
          const name = fullName(member);
          return <li key={member.id} className="flex items-center gap-3 py-3">
                <Avatar name={name} src={member.profile.avatarUrl} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{name}</p>
                  <p className="truncate text-xs text-slate-500">{member.email}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {member.role === 'ADMIN' ? <Badge variant="brand" size="sm">Admin</Badge> : null}
                  <Badge variant={member.isActive ? 'success' : 'danger'} size="sm">
                    {member.isActive ? 'Active' : 'Disabled'}
                  </Badge>
                  <span className="hidden text-xs text-slate-400 sm:inline">
                    {formatDate(member.createdAt)}
                  </span>
                </div>
              </li>;
        })}
        </ul>
      </section>
    </div>;
}
