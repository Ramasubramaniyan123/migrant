import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin } from 'lucide-react';
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

export default function LocationsPage() {
  const [stats, setStats] = useState(null);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([locationService.getStats(), locationService.listCities()])
      .then(([s, c]) => {
        setStats(s);
        setCities([...c].sort((a, b) => (b.userCount ?? 0) - (a.userCount ?? 0)).slice(0, 5));
      })
      .catch(err => setError(err?.message ?? 'Failed to load locations'))
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
        title="Locations"
        description="Manage cities and localities where migrants are located."
      />

      {isLoading ? (
        <Loader label="Loading locations…" />
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : (
        <>
          {stats ? (
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard label="Cities" value={formatNumber(stats.totalCities ?? 0)} />
              <StatCard label="Localities" value={formatNumber(stats.totalLocalities ?? 0)} />
              <StatCard label="Users in tracked locations" value={formatNumber(stats.usersInTrackedLocations ?? 0)} />
            </div>
          ) : null}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link to={ADMIN_ROUTES.cities} className="card flex items-center gap-4 p-5 transition-shadow hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Cities</p>
                <p className="text-sm text-slate-500">View and manage supported cities</p>
              </div>
            </Link>
            <Link to={ADMIN_ROUTES.localities} className="card flex items-center gap-4 p-5 transition-shadow hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Localities</p>
                <p className="text-sm text-slate-500">Manage neighbourhoods within cities</p>
              </div>
            </Link>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-base font-semibold text-slate-900">Top cities by users</h2>
            </div>
            <DataTable
              columns={columns}
              rows={cities}
              rowKey={c => c.id}
              emptyTitle="No cities"
              emptyDescription="No city data available."
            />
          </div>
        </>
      )}
    </div>
  );
}
