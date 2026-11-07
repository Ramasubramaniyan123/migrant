import { useEffect, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import Loader from '@/components/common/Loader';
import { locationService } from '@/services/locationService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatNumber } from '@/utils/helpers';

function StatCard({ label, value }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function CitiesPage() {
  const [cities, setCities] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([locationService.listCities(), locationService.getStats()])
      .then(([c, s]) => {
        setCities(c);
        setStats(s);
      })
      .catch(err => setError(err?.message ?? 'Failed to load cities'))
      .finally(() => setIsLoading(false));
  }, []);

  const columns = [
    { key: 'name', header: 'City', render: c => <span className="font-medium text-slate-900">{c.name}</span> },
    { key: 'state', header: 'State', render: c => c.state },
    { key: 'users', header: 'Users', render: c => formatNumber(c.userCount ?? 0) },
    { key: 'localities', header: 'Localities', render: c => formatNumber(c.localityCount ?? 0) }
  ];

  return (
    <div>
      <PageHeader
        title="Cities"
        description="Cities where migrant users are located."
        breadcrumbs={[
          { label: 'Locations', to: ADMIN_ROUTES.locations },
          { label: 'Cities' }
        ]}
      />

      {stats ? (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total cities" value={formatNumber(stats.totalCities ?? 0)} />
          <StatCard label="Total localities" value={formatNumber(stats.totalLocalities ?? 0)} />
          <StatCard label="Users in tracked locations" value={formatNumber(stats.usersInTrackedLocations ?? 0)} />
        </div>
      ) : null}

      {isLoading ? (
        <Loader label="Loading cities…" />
      ) : (
        <div className="card overflow-hidden">
          <DataTable
            columns={columns}
            rows={cities}
            rowKey={c => c.id}
            error={error}
            emptyTitle="No cities"
            emptyDescription="No city data available."
          />
        </div>
      )}
    </div>
  );
}
