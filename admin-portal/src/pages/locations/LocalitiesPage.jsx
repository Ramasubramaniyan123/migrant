import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import DataTable from '@/components/common/DataTable';
import Loader from '@/components/common/Loader';
import Modal from '@/components/common/Modal';
import { Input, Select } from '@/components/common/Input';
import { locationService } from '@/services/locationService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatNumber } from '@/utils/helpers';

export default function LocalitiesPage() {
  const [localities, setLocalities] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', cityId: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [l, c] = await Promise.all([locationService.listLocalities(), locationService.listCities()]);
      setLocalities(l);
      setCities(c);
      if (!form.cityId && c.length > 0) setForm(f => ({ ...f, cityId: c[0].id }));
    } catch (err) {
      setError(err?.message ?? 'Failed to load localities');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      await locationService.createLocality({ name: form.name.trim(), cityId: form.cityId });
      setModalOpen(false);
      setForm({ name: '', cityId: cities[0]?.id ?? '' });
      await load();
    } catch (err) {
      setFormError(err?.message ?? 'Failed to create locality');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: 'name', header: 'Locality', render: l => <span className="font-medium text-slate-900">{l.name}</span> },
    { key: 'city', header: 'City', render: l => l.cityName ?? '—' },
    { key: 'users', header: 'Users', render: l => formatNumber(l.userCount ?? 0) }
  ];

  return (
    <div>
      <PageHeader
        title="Localities"
        description="Neighbourhoods and localities within supported cities."
        breadcrumbs={[
          { label: 'Locations', to: ADMIN_ROUTES.locations },
          { label: 'Localities' }
        ]}
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>
            Add locality
          </Button>
        }
      />

      {isLoading ? (
        <Loader label="Loading localities…" />
      ) : (
        <div className="card overflow-hidden">
          <DataTable
            columns={columns}
            rows={localities}
            rowKey={l => l.id}
            error={error}
            emptyTitle="No localities"
            emptyDescription="Add a locality to get started."
          />
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add locality"
        description="Create a new locality within a city."
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" form="add-locality-form" isLoading={isSubmitting}>Add locality</Button>
          </>
        }
      >
        <form id="add-locality-form" onSubmit={handleCreate} className="space-y-4">
          {formError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>
          ) : null}
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            placeholder="e.g. Cyber City"
          />
          <Select
            label="City"
            name="cityId"
            value={form.cityId}
            onChange={e => setForm(f => ({ ...f, cityId: e.target.value }))}
            required
          >
            {cities.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </form>
      </Modal>
    </div>
  );
}
