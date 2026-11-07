import { formatDistance } from '@/utils/formatters';
import EmptyState from '@/components/common/EmptyState';
/**
 * Schematic proximity view — people are plotted by distance only.
 * Exact coordinates are never used, which keeps location data private.
 */
export default function NearbyMap({
  people,
  radiusKm,
  activeUserId,
  onSelect
}) {
  const visible = people.filter(person => person.distanceKm !== undefined);
  if (visible.length === 0) {
    return <div className="card">
        <h2 className="text-base font-semibold text-slate-900">Nearby map</h2>
        <div className="mt-4">
          <EmptyState title="No nearby people" description="Nobody matched with a known distance for this search." />
        </div>
      </div>;
  }
  return <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Nearby map</h2>
        <span className="text-xs font-medium text-slate-500">Within {radiusKm} km</span>
      </div>

      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-br from-brand-50 to-slate-100 ring-1 ring-inset ring-slate-200">
        {[0.33, 0.66, 1].map(ring => <div key={ring} aria-hidden="true" className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-brand-200" style={{
        width: `${ring * 88}%`,
        height: `${ring * 88}%`,
        transform: 'translate(-50%, -50%)'
      }} />)}

        <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600 ring-4 ring-brand-200" />

        {visible.map((person, index) => {
        const ratio = Math.min((person.distanceKm ?? 0) / radiusKm, 1);
        const angle = index * 137.5 % 360 * (Math.PI / 180);
        const left = 50 + Math.cos(angle) * ratio * 42;
        const top = 50 + Math.sin(angle) * ratio * 42;
        const isActive = activeUserId === person.id;
        return <button key={person.id} type="button" onClick={() => onSelect(person)} title={`${person.fullName} · ${formatDistance(person.distanceKm)}`} aria-label={`${person.fullName}, ${formatDistance(person.distanceKm)}`} className={'absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow transition ' + (isActive ? 'bg-brand-700 ring-2 ring-brand-300' : 'bg-brand-500 hover:bg-brand-600')} style={{
          left: `${left}%`,
          top: `${top}%`
        }} />;
      })}
      </div>

      <p className="muted">
        Positions are approximate and intentionally fuzzed — exact locations stay private.
      </p>
    </div>;
}
