import { languages } from '@/services/userService';
import { INTEREST_OPTIONS } from '@/utils/constants';
import { cn } from '@/utils/helpers';
import Button from '@/components/common/Button';
import SearchBar from '@/components/shared/SearchBar';
const selectClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const DISTANCE_OPTIONS = [5, 10, 25, 50, 100, 250];

/** Filter sidebar shared by the Discover screen. */
export default function DiscoveryFilters({
  filters,
  onChange,
  onReset
}) {
  const selectedInterests = filters.interests ?? [];
  const toggleInterest = interest => {
    const next = selectedInterests.includes(interest) ? selectedInterests.filter(value => value !== interest) : [...selectedInterests, interest];
    onChange({
      interests: next.length > 0 ? next : undefined
    });
  };
  return <div className="card space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      <SearchBar value={filters.query ?? ''} onChange={value => onChange({
      query: value || undefined
    })} placeholder="Name, city or interest" />

      <div className="space-y-1.5">
        <label htmlFor="discover-sort" className="text-sm font-medium text-slate-700">
          Sort by
        </label>
        <select id="discover-sort" className={selectClass} value={filters.sortBy ?? 'match'} onChange={event => onChange({
        sortBy: event.target.value
      })}>
          <option value="match">Best match</option>
          <option value="distance">Closest first</option>
          <option value="recent">Newest members</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="discover-language" className="text-sm font-medium text-slate-700">
          Language
        </label>
        <select id="discover-language" className={selectClass} value={filters.languageId ?? ''} onChange={event => onChange({
        languageId: event.target.value ? Number(event.target.value) : undefined
      })}>
          <option value="">Any language</option>
          {languages.map(language => <option key={language.id} value={language.id}>
              {language.name} · {language.nativeName}
            </option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="discover-distance" className="text-sm font-medium text-slate-700">
          Maximum distance
        </label>
        <select id="discover-distance" className={selectClass} value={filters.maxDistanceKm ?? ''} onChange={event => onChange({
        maxDistanceKm: event.target.value ? Number(event.target.value) : undefined
      })}>
          <option value="">Any distance</option>
          {DISTANCE_OPTIONS.map(distance => <option key={distance} value={distance}>
              Within {distance} km
            </option>)}
        </select>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Interests</p>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map(interest => {
          const isSelected = selectedInterests.includes(interest);
          return <button key={interest} type="button" aria-pressed={isSelected} onClick={() => toggleInterest(interest)} className={cn('rounded-full border px-3 py-1 text-xs font-medium transition-colors', isSelected ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50')}>
                {interest}
              </button>;
        })}
        </div>
      </div>
    </div>;
}
