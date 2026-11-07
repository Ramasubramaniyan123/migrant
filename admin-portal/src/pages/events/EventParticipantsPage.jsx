import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, CalendarDays } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import Loader from '@/components/common/Loader';
import StatusBadge, { statusTone, statusLabel } from '@/components/common/StatusBadge';
import { eventService } from '@/services/eventService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';

export default function EventParticipantsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [e, p] = await Promise.all([eventService.getById(id), eventService.listParticipants(id)]);
      setEvent(e);
      setParticipants(p);
    } catch (err) {
      setError(err.message || 'Failed to load participants');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const columns = [
    {
      key: 'user',
      header: 'Participant',
      render: p => <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{p.userName}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: p => (
        <StatusBadge tone={statusTone(p.status)} dot>{statusLabel(p.status)}</StatusBadge>
      )
    },
    {
      key: 'registered',
      header: 'Registered',
      render: p => <span className="text-sm text-slate-500">{formatDateTime(p.registeredAt)}</span>
    }
  ];

  return (
    <div>
      <PageHeader
        title={event ? `Participants — ${event.title}` : 'Event participants'}
        description={event ? `${event.communityName} · ${event.city}` : undefined}
        breadcrumbs={[
          { label: 'Events', to: ADMIN_ROUTES.events },
          ...(event ? [{ label: event.title, to: ADMIN_ROUTES.editEvent(event.id) }] : []),
          { label: 'Participants' }
        ]}
        actions={
          <Link to={ADMIN_ROUTES.events}>
            <span className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <ArrowLeft className="h-4 w-4" /> Back to events
            </span>
          </Link>
        }
      />

      {event ? (
        <div className="card mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 p-4 text-sm text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> {event.location}, {event.city}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" /> {formatDateTime(event.startsAt)}
          </span>
          <StatusBadge tone={statusTone(event.status)} dot>{statusLabel(event.status)}</StatusBadge>
        </div>
      ) : null}

      <div className="card">
        {loading ? (
          <Loader label="Loading participants…" />
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={participants}
              rowKey={p => p.id}
              emptyTitle="No participants"
              emptyDescription="No one has registered for this event yet."
            />
            <p className="border-t border-slate-100 px-4 py-3 text-sm text-slate-500 dark:border-slate-800">
              {participants.length} participant{participants.length === 1 ? '' : 's'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
