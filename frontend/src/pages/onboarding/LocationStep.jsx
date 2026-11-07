import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import LocationBadge from '@/components/shared/LocationBadge';
/** Plausible demo coordinates (Dubai) used when the member opts into approximate location. */
const DEMO_COORDINATES = {
  latitude: 25.2048,
  longitude: 55.2708
};

/** Step 4 of onboarding: where the member lives now and how precisely to share it. */
export default function LocationStep({
  data,
  onChange
}) {
  const hasCoordinates = data.latitude !== undefined && data.longitude !== undefined;
  return <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Current country" placeholder="United Arab Emirates" value={data.currentCountry} onChange={event => onChange({
        currentCountry: event.target.value
      })} />
        <Input label="Current city" placeholder="Dubai" value={data.currentCity} onChange={event => onChange({
        currentCity: event.target.value
      })} />
      </div>

      <div className="rounded-lg border border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-800">Approximate location</p>
            <p className="muted mt-0.5">We fuzz your coordinates so nobody can pinpoint you.</p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={() => onChange({
          latitude: DEMO_COORDINATES.latitude,
          longitude: DEMO_COORDINATES.longitude
        })}>
            {hasCoordinates ? 'Refresh approximate location' : 'Use approximate location'}
          </Button>
        </div>

        <div className="mt-4">
          <LocationBadge city={data.currentCity || undefined} country={data.currentCountry || undefined} approximate />
        </div>

        <label className="mt-4 flex items-start gap-2 text-sm text-slate-700">
          <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600" checked={data.shareExactLocation} onChange={event => onChange({
          shareExactLocation: event.target.checked
        })} />
          <span>
            Share my exact location with accepted connections only. Leaving this off keeps your
            location approximate.
          </span>
        </label>
      </div>
    </div>;
}
