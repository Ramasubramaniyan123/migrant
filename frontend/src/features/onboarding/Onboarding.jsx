import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { profileService, languageService } from '../../services/users/userService'
import { errorMessage } from '../../services/api/apiClient'
import { Spinner } from '../../components/ui/States'

const STEPS = [
  { key: 'welcome', title: 'Welcome' },
  { key: 'location', title: 'Current location' },
  { key: 'hometown', title: 'Hometown' },
  { key: 'language', title: 'Native language' },
  { key: 'interests', title: 'Interests' },
  { key: 'profile', title: 'Profile details' },
  { key: 'privacy', title: 'Privacy' },
]

const INTEREST_SUGGESTIONS = [
  'Travel', 'Food', 'Music', 'Sports', 'Art', 'Photography',
  'Cooking', 'Fitness', 'Reading', 'Technology', 'Film', 'Dancing',
]

const emptyForm = {
  currentCity: '',
  hometownCountry: '',
  hometownCity: '',
  language: '',
  interests: [],
  firstName: '',
  lastName: '',
  bio: '',
  dateOfBirth: '',
  gender: '',
  privacy: {
    showHometown: true,
    showCurrentCity: true,
    showExactLocation: false,
    allowConnectionRequests: true,
    allowDirectMessages: true,
    showOnlineStatus: false,
    discoverable: true,
  },
}

export const Onboarding = () => {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(emptyForm)
  const [customInterest, setCustomInterest] = useState('')
  const [languages, setLanguages] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    languageService.list()
      .then((list) => setLanguages(Array.isArray(list) ? list : []))
      .catch(() => setLanguages([]))
  }, [])

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))
  const setPrivacy = (patch) => setForm((f) => ({ ...f, privacy: { ...f.privacy, ...patch } }))

  const toggleInterest = (interest) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }))
  }

  const addCustomInterest = () => {
    const v = customInterest.trim()
    if (v && !form.interests.includes(v)) {
      setForm((f) => ({ ...f, interests: [...f.interests, v] }))
    }
    setCustomInterest('')
  }

  const canContinue = () => {
    switch (STEPS[step].key) {
      case 'location': return Boolean(form.currentCity.trim())
      case 'hometown': return Boolean(form.hometownCity.trim())
      case 'language': return true
      case 'profile': return Boolean(form.firstName.trim() && form.lastName.trim())
      default: return true
    }
  }

  const finish = async () => {
    setSaving(true)
    setError('')
    try {
      await profileService.update({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        bio: form.bio || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        hometownCountry: form.hometownCountry || undefined,
        hometownCity: form.hometownCity || undefined,
        currentCity: form.currentCity || undefined,
      })
      await profileService.updatePrivacy(form.privacy)
      for (const interest of form.interests) {
        try { await profileService.addInterest(interest) } catch { /* non-fatal */ }
      }
      if (form.language) {
        try {
          await profileService.addLanguage(Number(form.language), 'native', true)
        } catch { /* non-fatal — language can be added later in Settings */ }
      }
      navigate('/app/home', { replace: true })
    } catch (err) {
      setError(errorMessage(err, 'Could not save your profile. Please try again.'))
      setSaving(false)
    }
  }

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1)
    else finish()
  }

  const current = STEPS[step]

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Set up your profile</h1>
        <div className="mt-4 flex items-center gap-2" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label={`Step ${step + 1} of ${STEPS.length}`}>
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex flex-1 flex-col gap-1">
              <div className={`h-1.5 rounded-full ${i <= step ? 'bg-accent' : 'bg-line'}`} />
              <span className={`text-xs ${i === step ? 'font-medium text-accent' : 'text-ink-3'}`}>{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 md:p-8">
        <h2 className="font-display text-xl font-semibold">{current.title}</h2>

        {error && (
          <div className="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mt-6">
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-ink-2">
                Welcome aboard. A few quick steps and you'll be connected with people from
                your hometown, your language and your interests.
              </p>
              <ul className="space-y-2 text-sm text-ink-2">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Tell us where you live now</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Share your hometown and language</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Pick your interests and privacy preferences</li>
              </ul>
            </div>
          )}

          {step === 1 && (
            <div>
              <label htmlFor="ob-city" className="label">Which city do you currently live in?</label>
              <input id="ob-city" className="input" placeholder="e.g. London, Dubai, Toronto" value={form.currentCity} onChange={(e) => set({ currentCity: e.target.value })} />
              <p className="mt-2 text-xs text-ink-3">Only the city name is stored — we never share your exact location.</p>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ob-hcountry" className="label">Hometown country</label>
                <input id="ob-hcountry" className="input" placeholder="e.g. India" value={form.hometownCountry} onChange={(e) => set({ hometownCountry: e.target.value })} />
              </div>
              <div>
                <label htmlFor="ob-hcity" className="label">Hometown city</label>
                <input id="ob-hcity" className="input" placeholder="e.g. Bangalore" value={form.hometownCity} onChange={(e) => set({ hometownCity: e.target.value })} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <label htmlFor="ob-lang" className="label">Your native language</label>
              <select id="ob-lang" className="input" value={form.language} onChange={(e) => set({ language: e.target.value })}>
                <option value="">Select a language…</option>
                {languages.map((l) => (
                  <option key={l.id ?? l.code} value={l.id ?? l.code}>{l.name}{l.nativeName ? ` (${l.nativeName})` : ''}</option>
                ))}
              </select>
              <p className="mt-2 text-xs text-ink-3">Optional — pick your native language to improve matching.</p>
              {languages.length === 0 && (
                <p className="mt-2 text-xs text-ink-3">Language list is unavailable right now — you can update this later in Settings.</p>
              )}
            </div>
          )}

          {step === 4 && (
            <div>
              <span className="label">What are you interested in?</span>
              <div className="flex flex-wrap gap-2">
                {INTEREST_SUGGESTIONS.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleInterest(i)}
                    aria-pressed={form.interests.includes(i)}
                    className={`chip ${form.interests.includes(i) ? 'chip-active' : ''}`}
                  >
                    {i}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  className="input"
                  placeholder="Add your own interest"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomInterest())}
                  aria-label="Custom interest"
                />
                <button type="button" className="btn-outline" onClick={addCustomInterest}>Add</button>
              </div>
              {form.interests.length > 0 && (
                <p className="mt-3 text-sm text-ink-2">Selected: {form.interests.join(', ')}</p>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ob-fname" className="label">First name</label>
                <input id="ob-fname" className="input" value={form.firstName} onChange={(e) => set({ firstName: e.target.value })} />
              </div>
              <div>
                <label htmlFor="ob-lname" className="label">Last name</label>
                <input id="ob-lname" className="input" value={form.lastName} onChange={(e) => set({ lastName: e.target.value })} />
              </div>
              <div>
                <label htmlFor="ob-dob" className="label">Date of birth</label>
                <input id="ob-dob" type="date" className="input" value={form.dateOfBirth} onChange={(e) => set({ dateOfBirth: e.target.value })} />
              </div>
              <div>
                <label htmlFor="ob-gender" className="label">Gender</label>
                <select id="ob-gender" className="input" value={form.gender} onChange={(e) => set({ gender: e.target.value })}>
                  <option value="">Prefer not to say</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ob-bio" className="label">Bio (optional)</label>
                <textarea id="ob-bio" rows={3} className="input resize-y" value={form.bio} onChange={(e) => set({ bio: e.target.value })} />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-3">
              {[
                ['showHometown', 'Show my hometown'],
                ['showCurrentCity', 'Show my current city'],
                ['allowConnectionRequests', 'Allow connection requests'],
                ['allowDirectMessages', 'Allow direct messages'],
                ['discoverable', 'Let people discover my profile'],
                ['showOnlineStatus', 'Show when I\'m online'],
                ['showExactLocation', 'Share precise location (not recommended)'],
              ].map(([key, label]) => (
                <label key={key} className="flex cursor-pointer items-center gap-3 rounded-lg border border-line px-4 py-3 hover:bg-hover">
                  <input
                    type="checkbox"
                    checked={form.privacy[key]}
                    onChange={(e) => setPrivacy({ [key]: e.target.checked })}
                    className="h-4 w-4 accent-[var(--color-accent)]"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || saving}
          >
            Back
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-sm text-ink-3 hover:text-ink"
              onClick={() => navigate('/app/home')}
            >
              Skip for now
            </button>
            <button type="button" className="btn-accent" onClick={next} disabled={!canContinue() || saving}>
              {saving ? <Spinner className="h-4 w-4" /> : step === STEPS.length - 1 ? 'Finish' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
