import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import { Input } from '@/components/common/Input';
import { languageService } from '@/services/languageService';
import { ADMIN_ROUTES } from '@/utils/constants';

export default function EditLanguagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', nativeName: '', code: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    languageService.list()
      .then(list => {
        if (cancelled) return;
        const lang = list.find(l => l.id === id);
        if (!lang) {
          setNotFound(true);
          return;
        }
        setForm({ name: lang.name ?? '', nativeName: lang.nativeName ?? '', code: lang.code ?? '' });
      })
      .catch(err => setError(err?.message ?? 'Failed to load language'))
      .finally(() => !cancelled && setIsLoading(false));
    return () => { cancelled = true; };
  }, [id]);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await languageService.update(id, {
        name: form.name.trim(),
        nativeName: form.nativeName.trim(),
        code: form.code.trim()
      });
      navigate(ADMIN_ROUTES.languages);
    } catch (err) {
      setError(err?.message ?? 'Failed to update language');
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader label="Loading language…" />;

  if (notFound) {
    return (
      <div>
        <PageHeader title="Language not found" />
        <EmptyState
          title="Language not found"
          description="The requested language does not exist."
          action={
            <Link to={ADMIN_ROUTES.languages}>
              <Button variant="secondary">Back to languages</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="Edit language"
        description="Update language details."
        breadcrumbs={[
          { label: 'Languages', to: ADMIN_ROUTES.languages },
          { label: form.name || 'Edit' }
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
        <Input label="Name" name="name" value={form.name} onChange={set('name')} required />
        <Input label="Native name" name="nativeName" value={form.nativeName} onChange={set('nativeName')} required />
        <Input label="Code" name="code" value={form.code} onChange={set('code')} required hint="ISO 639-1 language code" />
        <div className="flex justify-end gap-3 pt-2">
          <Link to={ADMIN_ROUTES.languages}>
            <Button variant="secondary" type="button">Cancel</Button>
          </Link>
          <Button type="submit" isLoading={isSubmitting}>Save changes</Button>
        </div>
      </form>
    </div>
  );
}
