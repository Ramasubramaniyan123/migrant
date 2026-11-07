import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import { Input, Textarea, Select } from '@/components/common/Input';
import Loader from '@/components/common/Loader';
import { eventService } from '@/services/eventService';
import { communityService } from '@/services/communityService';
import { ADMIN_ROUTES } from '@/utils/constants';

const CITIES = ['Gurugram', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad', 'Noida', 'Kochi'];

function toLocalInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    Promise.all([
      eventService.getById(id),
      communityService.list({ pageSize: 100 })
    ])
      .then(([event, res]) => {
        if (!event) throw new Error('Event not found');
        setForm({
          title: event.title ?? '',
          description: event.description ?? '',
          communityId: event.communityId ?? '',
          location: event.location ?? '',
          city: event.city ?? '',
          startsAt: toLocalInput(event.startsAt),
          endsAt: toLocalInput(event.endsAt),
          capacity: event.capacity ?? ''
        });
        setCommunities(res.items);
      })
      .catch(err => setPageError(err.message || 'Failed to load event'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.communityId) next.communityId = 'Community is required';
    if (!form.location.trim()) next.location = 'Location is required';
    if (!form.city) next.city = 'City is required';
    if (!form.startsAt) next.startsAt = 'Start date is required';
    if (!form.endsAt) next.endsAt = 'End date is required';
    if (form.startsAt && form.endsAt && new Date(form.endsAt) <= new Date(form.startsAt)) {
      next.endsAt = 'End must be after start';
    }
    const cap = Number(form.capacity);
    if (!form.capacity || !Number.isFinite(cap) || cap <= 0) next.capacity = 'Enter a valid capacity';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setPageError(null);
    try {
      const community = communities.find(c => c.id === form.communityId);
      await eventService.update(id, {
        title: form.title.trim(),
        description: form.description.trim(),
        communityId: form.communityId,
        communityName: community?.name ?? '',
        location: form.location.trim(),
        city: form.city,
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
        capacity: Number(form.capacity)
      });
      navigate(ADMIN_ROUTES.events);
    } catch (err) {
      setPageError(err.message || 'Failed to update event');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Edit event" />
        <Loader label="Loading event…" />
      </div>
    );
  }

  if (!form) {
    return (
      <div>
        <PageHeader title="Edit event" />
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {pageError || 'Event not found'}
        </div>
        <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate(ADMIN_ROUTES.events)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Back to events
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit event"
        description={`Editing "${form.title}"`}
        breadcrumbs={[
          { label: 'Events', to: ADMIN_ROUTES.events },
          { label: 'Edit' }
        ]}
        actions={
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate(ADMIN_ROUTES.events)}>
            Back
          </Button>
        }
      />

      {pageError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {pageError}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="card max-w-3xl p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input label="Title" value={form.title} onChange={set('title')} error={errors.title} />
          </div>
          <div className="sm:col-span-2">
            <Textarea label="Description" value={form.description} onChange={set('description')} />
          </div>
          <Select label="Community" value={form.communityId} onChange={set('communityId')} error={errors.communityId}>
            <option value="">Select a community…</option>
            {communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select label="City" value={form.city} onChange={set('city')} error={errors.city}>
            <option value="">Select a city…</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Input label="Location" value={form.location} onChange={set('location')} error={errors.location} />
          <Input label="Capacity" type="number" min="1" value={form.capacity} onChange={set('capacity')} error={errors.capacity} />
          <Input label="Starts at" type="datetime-local" value={form.startsAt} onChange={set('startsAt')} error={errors.startsAt} />
          <Input label="Ends at" type="datetime-local" value={form.endsAt} onChange={set('endsAt')} error={errors.endsAt} />
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <Button variant="secondary" type="button" onClick={() => navigate(ADMIN_ROUTES.events)}>
            Cancel
          </Button>
          <Button type="submit" isLoading={saving}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
