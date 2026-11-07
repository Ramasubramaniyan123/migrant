import { RotateCcw } from 'lucide-react';
import Button from '@/components/common/Button';
import SearchBar from '@/components/common/SearchBar';
import { Select } from '@/components/common/Input';
import { statusLabel } from '@/components/common/StatusBadge';

export default function UserFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  city,
  onCityChange,
  language,
  onLanguageChange,
  cities = [],
  languages = [],
  statuses = [],
  onReset
}) {
  return (
    <div className="card mb-4 flex flex-col gap-3 p-4 lg:flex-row lg:items-end">
      <SearchBar
        value={search}
        onChange={onSearchChange}
        placeholder="Search by name, email or hometown…"
        className="flex-1"
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select label="Status" name="status" value={status} onChange={e => onStatusChange(e.target.value)}>
          <option value="ALL">All statuses</option>
          {statuses.map(s => (
            <option key={s} value={s}>{statusLabel(s)}</option>
          ))}
        </Select>
        <Select label="City" name="city" value={city} onChange={e => onCityChange(e.target.value)}>
          <option value="ALL">All cities</option>
          {cities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <Select label="Language" name="language" value={language} onChange={e => onLanguageChange(e.target.value)}>
          <option value="ALL">All languages</option>
          {languages.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </Select>
        <div className="flex items-end">
          <Button variant="secondary" onClick={onReset} leftIcon={<RotateCcw className="h-4 w-4" />}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
