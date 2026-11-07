import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, Users, UserCheck } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/widgets/StatCard';
import DataTable from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';
import SearchBar from '@/components/common/SearchBar';
import { Select } from '@/components/common/Input';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import StatusBadge, { statusTone, statusLabel } from '@/components/common/StatusBadge';
import { eventService } from '@/services/eventService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';

const CITIES = ['Gurugram', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad', 'Noida', 'Kochi'];
const STATUS_OPTIONS = ['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];

export default function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('ALL');
  const [city, setCity] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, s] = await Promise.all([
        eventService.list({ status: 'ALL', city: 'ALL', search: '' }),
        eventService.getStats()
      ]);
      setEvents(list);
      setStats(s);
    } catch (err) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter(e => {
      if (status !== 'ALL' && e.status !== status) return false;
      if (city !== 'ALL' && e.city !== city) return false;
      if (q && !e.title.toLowerCase().includes(q) && !e.communityName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [events, status, city, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleCancel = async () => {
    setBusy(true);
    setActionError(null);
    try {
      await eventService.cancel(cancelTarget.id);
      setCancelTarget(null);
      await load();
    } catch (err) {
      setActionError(err.message || 'Failed to cancel event');
    } finally {
      setBusy(false);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Event',
      render: e => (
        <div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{e.title}</p>
          <p className="text-xs text-slate-400">{e.communityName}</p>
        </div>
      )
    },
    {
      key: 'city',
      header: 'City',
      render: e => (
        <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5" /> {e.city}
        </span>
      )
    },
    {
      key: 'date',
      header: 'Date',
      render: e => (
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <p>{formatDateTime(e.startsAt)}</p>
          <p className="text-xs text-slate-400">→ {formatDateTime(e.endsAt)}</p>
        </div>
      )
    },
    {
      key: 'participants',
      header: 'Participants',
      render: e => (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {e.participantCount} / {e.capacity}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: e => (
        <StatusBadge tone={statusTone(e.status)} dot>{statusLabel(e.status)}</StatusBadge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-40',
      render: e => (
        <div className="flex items-center gap-1.5" onClick={ev => ev.stopPropagation()}>
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<UserCheck className="h-3.5 w-3.5" />}
            onClick={() => navigate(ADMIN_ROUTES.eventParticipants(e.id))}
          >
            Participants
          </Button>
          {e.status !== 'CANCELLED' && e.status !== 'COMPLETED' ? (
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600 hover:bg-red-50"
              onClick={() => setCancelTarget(e)}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Events"
        description="Community events — review, edit and manage participation."
        actions={
          <Button onClick={() => navigate(ADMIN_ROUTES.createEvent)}>Create event</Button>
        }
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {actionError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total events" value={stats?.total ?? '—'} icon={<CalendarDays className="h-5 w-5" />} />
        <StatCard label="Upcoming" value={stats?.upcoming ?? '—'} icon={<CalendarDays className="h-5 w-5" />} />
        <StatCard label="Ongoing" value={stats?.ongoing ?? '—'} icon={<CalendarDays className="h-5 w-5" />} />
        <StatCard label="Total participants" value={stats?.totalParticipants ?? '—'} icon={<Users className="h-5 w-5" />} />
      </div>

      <div className="card mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <SearchBar
          value={search}
          onChange={v => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search events…"
          className="sm:max-w-sm"
        />
        <div className="sm:w-44">
          <Select
            label="Status"
            value={status}
            onChange={e => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            {STATUS_OPTIONS.map(o => <option key={o} value={o}>{statusLabel(o)}</option>)}
          </Select>
        </div>
        <div className="sm:w-44">
          <Select
            label="City"
            value={city}
            onChange={e => {
              setCity(e.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All cities</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          rows={pageItems}
          rowKey={e => e.id}
          isLoading={loading}
          error={error}
          emptyTitle="No events found"
          emptyDescription="Try adjusting the filters above."
          onRowClick={e => navigate(ADMIN_ROUTES.editEvent(e.id))}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          total={filtered.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          itemLabel="events"
        />
      </div>

      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Cancel event"
        message={`Cancel "${cancelTarget?.title}"? Registered participants will be notified.`}
        confirmLabel="Cancel event"
        danger
        isLoading={busy}
      />
    </div>
  );
}
