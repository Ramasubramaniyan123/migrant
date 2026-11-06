import LanguageSelector from '@/components/shared/LanguageSelector'
import type { OnboardingFormData } from '@/types/user.types'
import { languageById } from '@/services/userService'
import { cn } from '@/utils/helpers'

interface StepProps {
  data: OnboardingFormData
  onChange: (patch: Partial<OnboardingFormData>) => void
}

/** Step 2 of onboarding: which languages the member speaks and their primary one. */
export default function LanguageStep({ data, onChange }: StepProps) {
  const selectedIds = data.languageIds

  function handleLanguages(ids: number[]) {
    const primary =
      data.primaryLanguageId && ids.includes(data.primaryLanguageId)
        ? data.primaryLanguageId
        : ids[0]
    onChange({ languageIds: ids, primaryLanguageId: primary })
  }

  return (
    <div className="space-y-6">
      <LanguageSelector
        selectedIds={selectedIds}
        onChange={handleLanguages}
        label="Languages you speak"
        hint="Pick every language you are comfortable chatting in."
      />

      {selectedIds.length > 0 && (
        <fieldset>
          <legend className="text-sm font-medium text-slate-700">Primary language</legend>
          <p className="muted mt-0.5">This is the language we will use to match you first.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {selectedIds.map((id) => {
              const language = languageById(id)
              const isPrimary = data.primaryLanguageId === id
              return (
                <label
                  key={id}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition',
                    isPrimary ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300',
                  )}
                >
                  <input
                    type="radio"
                    name="primaryLanguage"
                    className="h-4 w-4 text-brand-600"
                    checked={isPrimary}
                    onChange={() => onChange({ primaryLanguageId: id })}
                  />
                  <span className="text-sm font-medium text-slate-800">
                    {language?.name ?? `Language ${id}`}
                  </span>
                  {language?.nativeName && (
                    <span className="ml-auto text-sm text-slate-500">{language.nativeName}</span>
                  )}
                </label>
              )
            })}
          </div>
        </fieldset>
      )}
    </div>
  )
}
