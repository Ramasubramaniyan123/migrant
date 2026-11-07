import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fullName } from '@/services/userService';
import { useUsers } from '@/hooks/useUsers';
import { ROUTES } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';
import SearchBar from '@/components/shared/SearchBar';
const STATUS_TABS = [{
  key: 'all',
  label: 'All'
}, {
  key: 'active',
  label: 'Active'
}, {
  key: 'disabled',
  label: 'Disabled'
}];

/** Admin table for browsing members and toggling their access. */
export default function UserManagement() {
  const {
    users,
    isLoading
  } = useUsers();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [overrides, setOverrides] = useState({});
  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.map(user => ({
      user,
      active: overrides[user.id] ?? user.isActive
    })).filter(({
      user,
      active
    }) => {
      if (status === 'active' && !active) return false;
      if (status === 'disabled' && active) return false;
      if (!query) return true;
      const name = fullName(user).toLowerCase();
      return name.includes(query) || user.email.toLowerCase().includes(query);
    }).sort((a, b) => Date.parse(b.user.createdAt) - Date.parse(a.user.createdAt));
  }, [users, search, status, overrides]);
  const toggleActive = (id, current) => {
    setOverrides(prev => ({
      ...prev,
      [id]: !current
    }));
  };
  return <div className="mx-auto w-full max-w-6xl space-y-6">
      <header>
        <h1 className="page-title">User management</h1>
        <p className="muted mt-1">{rows.length} of {users.length} members shown</p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email" className="sm:max-w-sm" />
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          {STATUS_TABS.map(tab => <button key={tab.key} type="button" onClick={() => setStatus(tab.key)} className={'rounded-md px-4 py-1.5 text-sm font-medium transition ' + (status === tab.key ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100')}>
              {tab.label}
            </button>)}
        </div>
      </div>

      {isLoading ? <Loader label="Loading members…" /> : rows.length === 0 ? <EmptyState title="No members found" description="Try a different search term or filter." /> : <div className="card overflow-x-auto p-0">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Member</th>
                <th scope="col" className="px-4 py-3 font-medium">Role</th>
                <th scope="col" className="px-4 py-3 font-medium">Joined</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(({
            user,
            active
          }) => {
            const name = fullName(user);
            return <tr key={user.id} className="align-middle">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={name} src={user.profile.avatarUrl} size="sm" />
                        <div className="min-w-0">
                          <Link to={ROUTES.userProfile(user.id)} className="block truncate font-medium text-slate-900 hover:underline">
                            {name}
                          </Link>
                          <span className="block truncate text-xs text-slate-500">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === 'ADMIN' ? 'brand' : 'neutral'} size="sm">
                        {user.role === 'ADMIN' ? 'Admin' : 'Member'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={active ? 'success' : 'danger'} size="sm">
                        {active ? 'Active' : 'Disabled'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant={active ? 'ghost' : 'secondary'} onClick={() => toggleActive(user.id, active)}>
                        {active ? 'Disable' : 'Enable'}
                      </Button>
                    </td>
                  </tr>;
          })}
            </tbody>
          </table>
        </div>}
    </div>;
}
