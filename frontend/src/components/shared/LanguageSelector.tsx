import { languages } from '@/services/userService'
import { cn } from '@/utils/helpers'

interface LanguageSelectorProps {
  selectedIds: number[]
  onChange: (ids: number[]) => void
  label?: string
  hint?: string
  max?: number
}

/** Multi-select chip picker for the languages a user speaks. */
export default function LanguageSelector({
  selectedIds,
  onChange,
  label,
  hint,
  max,
}: LanguageSelectorProps) {
  const toggle = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((value) => value !== id))
      return
    }
    if (max !== undefined && selectedIds.length >= max) return
    onChange([...selectedIds, id])
  }

  const limitReached = max !== undefined && selectedIds.length >= max

  return (
    <div className="flex flex-col gap-2">
      {label ? <span className="text-sm font-medium text-slate-700">{label}</span> : null}
      <div role="group" aria-label={label ?? 'Languages'} className="flex flex-wrap gap-2">
        {languages.map((language) => {
          const isSelected = selectedIds.includes(language.id)
          const isDisabled = !isSelected && limitReached
          return (
            <button
              key={language.id}
              type="button"
              onClick={() => toggle(language.id)}
              aria-pressed={isSelected}
              disabled={isDisabled}
              className={cn(
                'inline-flex flex-col rounded-lg border px-3 py-1.5 text-left transition-colors',
                isSelected
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50',
                isDisabled && 'cursor-not-allowed opacity-50',
              )}
            >
              <span className="text-sm font-medium">{language.name}</span>
              <span className="text-xs text-slate-400">{language.nativeName}</span>
            </button>
          )
        })}
      </div>
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}
