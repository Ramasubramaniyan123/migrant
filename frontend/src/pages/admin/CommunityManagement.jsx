import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { communityService } from '@/services/communityService';
import { languageById } from '@/services/userService';
import { formatCount } from '@/utils/formatters';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';
import SearchBar from '@/components/shared/SearchBar';

/** Admin listing of every community with moderation actions. */
export default function CommunityManagement() {
  const [communities, setCommunities] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hiddenIds, setHiddenIds] = useState([]);
  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setCommunities(await communityService.getCommunities(search));
    } finally {
      setIsLoading(false);
    }
  }, [search]);
  useEffect(() => {
    void load();
  }, [load]);
  const toggleHidden = id => {
    setHiddenIds(prev => prev.includes(id) ? prev.filter(value => value !== id) : [...prev, id]);
  };
  return <div className="mx-auto w-full max-w-5xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Community management</h1>
          <p className="muted mt-1">{communities.length} communities</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search communities" className="sm:max-w-xs" />
      </header>

      {isLoading ? <Loader label="Loading communities…" /> : communities.length === 0 ? <EmptyState title="No communities found" description="Try a different search term." /> : <div className="card overflow-x-auto p-0">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Community</th>
                <th scope="col" className="px-4 py-3 font-medium">Language</th>
                <th scope="col" className="px-4 py-3 font-medium">City</th>
                <th scope="col" className="px-4 py-3 font-medium">Members</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {communities.map(community => {
            const language = languageById(community.languageId);
            const isHidden = hiddenIds.includes(community.id);
            return <tr key={community.id} className="align-middle">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/communities/${community.id}`} className="font-medium text-slate-900 hover:underline">
                          {community.name}
                        </Link>
                        {isHidden ? <Badge variant="danger" size="sm">
                            Hidden
                          </Badge> : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{language?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{community.locationCity ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{formatCount(community.memberCount)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant={isHidden ? 'secondary' : 'ghost'} onClick={() => toggleHidden(community.id)}>
                        {isHidden ? 'Restore' : 'Hide'}
                      </Button>
                    </td>
                  </tr>;
          })}
            </tbody>
          </table>
        </div>}
    </div>;
}
