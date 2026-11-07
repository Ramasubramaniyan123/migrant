import { INTEREST_OPTIONS } from '@/utils/constants';
import { cn } from '@/utils/helpers';
const MAX_INTERESTS = 8;

/** Step 5 of onboarding: pick interests that power smarter matches. */
export default function InterestsStep({
  data,
  onChange
}) {
  const selected = data.interests;
  function toggleInterest(interest) {
    if (selected.includes(interest)) {
      onChange({
        interests: selected.filter(item => item !== interest)
      });
      return;
    }
    if (selected.length >= MAX_INTERESTS) return;
    onChange({
      interests: [...selected, interest]
    });
  }
  return <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="muted">Pick up to {MAX_INTERESTS} interests to help us match you.</p>
        <span className="shrink-0 text-sm font-medium text-slate-700">
          {selected.length}/{MAX_INTERESTS} selected
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {INTEREST_OPTIONS.map(interest => {
        const isSelected = selected.includes(interest);
        const isDisabled = !isSelected && selected.length >= MAX_INTERESTS;
        return <button key={interest} type="button" disabled={isDisabled} aria-pressed={isSelected} onClick={() => toggleInterest(interest)} className={cn('rounded-full border px-3 py-1.5 text-sm transition', isSelected ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400', isDisabled && 'cursor-not-allowed opacity-50')}>
              {interest}
            </button>;
      })}
      </div>
    </div>;
}
