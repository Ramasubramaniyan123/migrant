import Input, { Textarea } from '@/components/common/Input';
const GENDER_OPTIONS = [{
  value: 'MALE',
  label: 'Male'
}, {
  value: 'FEMALE',
  label: 'Female'
}, {
  value: 'OTHER',
  label: 'Other'
}, {
  value: 'PREFER_NOT_TO_SAY',
  label: 'Prefer not to say'
}];
const MAX_BIO_LENGTH = 300;

/** Step 1 of onboarding: the basics that make a profile feel human. */
export default function BasicInfoStep({
  data,
  onChange
}) {
  return <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="First name" placeholder="Aarav" value={data.firstName} onChange={event => onChange({
        firstName: event.target.value
      })} />
        <Input label="Last name" placeholder="Sharma" value={data.lastName} onChange={event => onChange({
        lastName: event.target.value
      })} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Date of birth" type="date" value={data.dateOfBirth} onChange={event => onChange({
        dateOfBirth: event.target.value
      })} />
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-slate-700">
            Gender
          </label>
          <select id="gender" value={data.gender} onChange={event => onChange({
          gender: event.target.value
        })} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30">
            <option value="">Select…</option>
            {GENDER_OPTIONS.map(option => <option key={option.value} value={option.value}>
                {option.label}
              </option>)}
          </select>
        </div>
      </div>

      <Textarea label="Short bio" rows={4} maxLength={MAX_BIO_LENGTH} placeholder="Tell people a little about you — what brought you here and what you enjoy." value={data.bio} hint={`${data.bio.length}/${MAX_BIO_LENGTH} characters`} onChange={event => onChange({
      bio: event.target.value
    })} />
    </div>;
}
