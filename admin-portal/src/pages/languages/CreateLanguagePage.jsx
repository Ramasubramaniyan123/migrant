import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { languageService } from '@/services/languageService';
import { ADMIN_ROUTES } from '@/utils/constants';

export default function CreateLanguagePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', nativeName: '', code: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await languageService.create({
        name: form.name.trim(),
        nativeName: form.nativeName.trim(),
        code: form.code.trim()
      });
      navigate(ADMIN_ROUTES.languages);
    } catch (err) {
      setError(err?.message ?? 'Failed to create language');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="Add language"
        description="Create a new supported language."
        breadcrumbs={[
          { label: 'Languages', to: ADMIN_ROUTES.languages },
          { label: 'New' }
        ]}
        actions={
          <Link to={ADMIN_ROUTES.languages}>
            <Button variant="secondary" leftIcon={<ArrowLeft className="h-4 w-4" />}>Back</Button>
          </Link>
        }
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <Input label="Name" name="name" value={form.name} onChange={set('name')} required placeholder="e.g. Tamil" />
        <Input label="Native name" name="nativeName" value={form.nativeName} onChange={set('nativeName')} required placeholder="e.g. தமிழ்" />
        <Input label="Code" name="code" value={form.code} onChange={set('code')} required placeholder="e.g. ta" hint="ISO 639-1 language code" />
        <div className="flex justify-end gap-3 pt-2">
          <Link to={ADMIN_ROUTES.languages}>
            <Button variant="secondary" type="button">Cancel</Button>
          </Link>
          <Button type="submit" isLoading={isSubmitting}>Create language</Button>
        </div>
      </form>
    </div>
  );
}
