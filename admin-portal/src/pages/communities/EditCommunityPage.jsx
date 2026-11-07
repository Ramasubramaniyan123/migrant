import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { Input, Textarea, Select } from '@/components/common/Input';
import { communityService } from '@/services/communityService';
import { ADMIN_ROUTES } from '@/utils/constants';
import {
  COMMUNITY_TYPE_OPTIONS,
  COMMUNITY_LANGUAGE_OPTIONS,
  COMMUNITY_CITY_OPTIONS
} from './CreateCommunityPage';

export default function EditCommunityPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'HOMETOWN',
    language: '',
    hometown: '',
    city: 'Gurugram',
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    communityService.getById(id)
      .then(c => {
        if (cancelled || !c) return;
        setForm({
          name: c.name ?? '',
          description: c.description ?? '',
          type: c.type ?? 'HOMETOWN',
          language: c.language ?? '',
          hometown: c.hometown ?? '',
          city: c.city ?? 'Gurugram',
          isActive: !!c.isActive
        });
      })
      .catch(err => setError(err?.message ?? 'Failed to load community'))
      .finally(() => !cancelled && setIsLoading(false));
    return () => { cancelled = true; };
  }, [id]);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const patch = {
        name: form.name.trim(),
        description: form.description.trim(),
        type: form.type,
        city: form.city,
        isActive: form.isActive
      };
      if (form.type === 'LANGUAGE') patch.language = form.language || undefined;
      if (form.type === 'HOMETOWN') patch.hometown = form.hometown || undefined;
      await communityService.update(id, patch);
      navigate(ADMIN_ROUTES.communityDetails(id));
    } catch (err) {
      setError(err?.message ?? 'Failed to update community');
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader label="Loading community…" />;

  if (error && !form.name) {
    return (
      <div>
        <PageHeader title="Community not found" />
        <EmptyState
          title="Community not found"
          description={error}
          action={
            <Link to={ADMIN_ROUTES.communities}>
              <Button variant="secondary">Back to communities</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Edit community"
        description="Update community details."
        breadcrumbs={[
          { label: 'Communities', to: ADMIN_ROUTES.communities },
          { label: form.name || 'Edit' }
        ]}
        actions={
          <Link to={ADMIN_ROUTES.communityDetails(id)}>
            <Button variant="secondary" leftIcon={<ArrowLeft className="h-4 w-4" />}>Back</Button>
          </Link>
        }
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <Input label="Name" name="name" value={form.name} onChange={set('name')} required />
        <Textarea label="Description" name="description" value={form.description} onChange={set('description')} required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Type" name="type" value={form.type} onChange={set('type')}>
            {COMMUNITY_TYPE_OPTIONS.map(t => (
              <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
            ))}
          </Select>
          {form.type === 'LANGUAGE' ? (
            <Select label="Language" name="language" value={form.language} onChange={set('language')}>
              <option value="">Select language</option>
              {COMMUNITY_LANGUAGE_OPTIONS.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </Select>
          ) : form.type === 'HOMETOWN' ? (
            <Input label="Hometown" name="hometown" value={form.hometown} onChange={set('hometown')} placeholder="e.g. Tamil Nadu" />
          ) : null}
          <Select label="City" name="city" value={form.city} onChange={set('city')}>
            {COMMUNITY_CITY_OPTIONS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={form.isActive} onChange={set('isActive')} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
          Active (visible to members)
        </label>
        <div className="flex justify-end gap-3 pt-2">
          <Link to={ADMIN_ROUTES.communityDetails(id)}>
            <Button variant="secondary" type="button">Cancel</Button>
          </Link>
          <Button type="submit" isLoading={isSubmitting}>Save changes</Button>
        </div>
      </form>
    </div>
  );
}
