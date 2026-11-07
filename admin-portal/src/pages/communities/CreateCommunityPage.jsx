import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import { Input, Textarea, Select } from '@/components/common/Input';
import { communityService } from '@/services/communityService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { ArrowLeft } from 'lucide-react';

export const COMMUNITY_TYPE_OPTIONS = ['LANGUAGE', 'HOMETOWN', 'INTEREST', 'WORKPLACE'];
export const COMMUNITY_LANGUAGE_OPTIONS = ['Tamil', 'Malayalam', 'Hindi', 'Telugu', 'Marathi', 'Kannada', 'Bengali', 'Gujarati', 'Urdu'];
export const COMMUNITY_CITY_OPTIONS = ['Gurugram', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Noida'];

export default function CreateCommunityPage() {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        type: form.type,
        city: form.city,
        isActive: form.isActive,
        createdBy: 'admin'
      };
      if (form.type === 'LANGUAGE' && form.language) payload.language = form.language;
      if (form.type === 'HOMETOWN' && form.hometown) payload.hometown = form.hometown;
      await communityService.create(payload);
      navigate(ADMIN_ROUTES.communities);
    } catch (err) {
      setError(err?.message ?? 'Failed to create community');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Create community"
        description="Set up a new community group."
        breadcrumbs={[
          { label: 'Communities', to: ADMIN_ROUTES.communities },
          { label: 'New community' }
        ]}
        actions={
          <Link to={ADMIN_ROUTES.communities}>
            <Button variant="secondary" leftIcon={<ArrowLeft className="h-4 w-4" />}>Back</Button>
          </Link>
        }
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <Input label="Name" name="name" value={form.name} onChange={set('name')} required placeholder="e.g. Tamil Nadu Migrants – Pune" />
        <Textarea label="Description" name="description" value={form.description} onChange={set('description')} required placeholder="What is this community about?" />
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
          <Link to={ADMIN_ROUTES.communities}>
            <Button variant="secondary" type="button">Cancel</Button>
          </Link>
          <Button type="submit" isLoading={isSubmitting}>Create community</Button>
        </div>
      </form>
    </div>
  );
}
