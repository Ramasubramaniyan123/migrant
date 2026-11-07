import { formatDistance } from '@/utils/formatters';
/** Small pill showing a user's place and, optionally, the distance to them. */
export default function LocationBadge({
  city,
  country,
  distanceKm,
  approximate
}) {
  const place = [city, country].filter(Boolean).join(', ');
  const distance = distanceKm !== undefined ? formatDistance(distanceKm) : undefined;
  if (!place && !distance) return null;
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-slate-400" aria-hidden="true">
        <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
      <span>{place}</span>
      {distance ? <span className="text-slate-400">· {distance}</span> : null}
      {approximate ? <span className="text-slate-400" title="Location is intentionally approximate">
          (approx.)
        </span> : null}
    </span>;
}
