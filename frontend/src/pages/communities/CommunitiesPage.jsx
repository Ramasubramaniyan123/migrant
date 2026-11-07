import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { communityService } from '@/services/communityService';
import { languages } from '@/services/userService';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import Input, { Textarea } from '@/components/common/Input';
import Loader from '@/components/common/Loader';
import Modal from '@/components/common/Modal';
import SearchBar from '@/components/shared/SearchBar';
import CommunityCard from './CommunityCard';
const selectClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const emptyForm = {
  name: '',
  description: '',
  languageId: '',
  city: '',
  country: ''
};

/** Community directory with search, joined/all filter and a create-community dialog. */
export default function CommunitiesPage() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id;
  const [communities, setCommunities] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const loadCommunities = useCallback(async () => {
    setIsLoading(true);
    try {
      setCommunities(await communityService.getCommunities(search));
    } finally {
      setIsLoading(false);
    }
  }, [search]);
  const loadMemberships = useCallback(async () => {
    if (!userId) {
      setMemberships([]);
      return;
    }
    setMemberships(await communityService.getMembershipsForUser(userId));
  }, [userId]);
  useEffect(() => {
    void loadCommunities();
  }, [loadCommunities]);
  useEffect(() => {
    void loadMemberships();
  }, [loadMemberships]);
  const membershipByCommunity = useMemo(() => {
    const map = new Map();
    memberships.forEach(membership => map.set(membership.communityId, membership));
    return map;
  }, [memberships]);
  const visibleCommunities = useMemo(() => tab === 'joined' ? communities.filter(community => membershipByCommunity.has(community.id)) : communities, [communities, membershipByCommunity, tab]);
  const toggleMembership = async community => {
    if (!userId) return;
    if (membershipByCommunity.has(community.id)) {
      await communityService.leaveCommunity(userId, community.id);
    } else {
      await communityService.joinCommunity(userId, community.id);
    }
    await Promise.all([loadCommunities(), loadMemberships()]);
  };
  const handleCreate = async () => {
    if (!userId || !form.name.trim()) return;
    setIsSaving(true);
    try {
      await communityService.createCommunity(userId, {
        name: form.name.trim(),
        description: form.description.trim(),
        languageId: form.languageId ? Number(form.languageId) : null,
        locationCity: form.city.trim() || undefined,
        locationCountry: form.country.trim() || undefined
      });
      setForm(emptyForm);
      setIsCreateOpen(false);
      await Promise.all([loadCommunities(), loadMemberships()]);
    } finally {
      setIsSaving(false);
    }
  };
  return <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Communities</h1>
          <p className="muted mt-1">Find your people by language, city and shared interests.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>Create community</Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={setSearch} placeholder="Search communities by name or city" className="sm:max-w-sm" />
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          {['joined', 'all'].map(value => <button key={value} type="button" onClick={() => setTab(value)} className={'rounded-md px-4 py-1.5 text-sm font-medium transition ' + (tab === value ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100')}>
              {value === 'joined' ? 'Joined' : 'All'}
            </button>)}
        </div>
      </div>

      {isLoading ? <Loader label="Loading communities…" /> : visibleCommunities.length === 0 ? <EmptyState title={tab === 'joined' ? 'No joined communities yet' : 'No communities found'} description={tab === 'joined' ? 'Join a community to see it here, or explore all communities.' : 'Try a different search term or create a new community.'} action={tab === 'joined' ? <Button variant="secondary" onClick={() => setTab('all')}>
                Browse all communities
              </Button> : <Button onClick={() => setIsCreateOpen(true)}>Create community</Button>} /> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleCommunities.map(community => <CommunityCard key={community.id} community={community} isMember={membershipByCommunity.has(community.id)} onOpen={() => navigate(ROUTES.communityDetails(community.id))} onToggleMembership={() => void toggleMembership(community)} />)}
        </div>}

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create a community" size="md" footer={<div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleCreate()} isLoading={isSaving} disabled={!form.name.trim()}>
              Create
            </Button>
          </div>}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={event => setForm(prev => ({
          ...prev,
          name: event.target.value
        }))} placeholder="e.g. Hindi Dubai Community" required />
          <Textarea label="Description" value={form.description} onChange={event => setForm(prev => ({
          ...prev,
          description: event.target.value
        }))} placeholder="What is this community about?" rows={3} />
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Language</label>
            <select className={selectClass} value={form.languageId} onChange={event => setForm(prev => ({
            ...prev,
            languageId: event.target.value
          }))}>
              <option value="">Any language</option>
              {languages.map(language => <option key={language.id} value={language.id}>
                  {language.name} · {language.nativeName}
                </option>)}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="City" value={form.city} onChange={event => setForm(prev => ({
            ...prev,
            city: event.target.value
          }))} placeholder="Dubai" />
            <Input label="Country" value={form.country} onChange={event => setForm(prev => ({
            ...prev,
            country: event.target.value
          }))} placeholder="United Arab Emirates" />
          </div>
        </div>
      </Modal>
    </div>;
}
