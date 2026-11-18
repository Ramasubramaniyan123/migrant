import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts'
import { profileService, languageService } from '../../services/users/userService'
import { uploadService } from '../../services/uploads/uploadService'
import { errorMessage } from '../../services/api/apiClient'
import { Avatar } from '../../components/ui/Avatar'
import { LoadingState, ErrorState } from '../../components/ui/States'
import { PageHeader } from '../../components/ui/PageHeader'

const PRIVACY_FIELDS = [
  ['showHometown', 'Show my hometown'],
  ['showCurrentCity', 'Show my current city'],
  ['showExactLocation', 'Share precise location'],
  ['allowConnectionRequests', 'Allow connection requests'],
  ['allowDirectMessages', 'Allow direct messages'],
  ['showOnlineStatus', 'Show when I\'m online'],
  ['discoverable', 'Let people discover my profile'],
]

export const Settings = () => {
  const { user, logout, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', bio: '', currentCity: '', hometownCity: '', hometownCountry: '' })
  const [privacy, setPrivacy] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [deactivating, setDeactivating] = useState(false)

  const [interests, setInterests] = useState([])
  const [newInterest, setNewInterest] = useState('')
  const [interestBusy, setInterestBusy] = useState(false)
  const [languages, setLanguages] = useState([])
  const [languageOptions, setLanguageOptions] = useState([])
  const [newLanguageId, setNewLanguageId] = useState('')
  const [languageBusy, setLanguageBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const d = await profileService.details()
      setProfile(d)
      setInterests(d.interests || [])
      setLanguages(d.languages || [])
      setForm({
        firstName: d.firstName || '',
        lastName: d.lastName || '',
        bio: d.bio || '',
        currentCity: d.currentCity || '',
        hometownCity: d.hometownCity || '',
        hometownCountry: d.hometownCountry || '',
      })
      setPrivacy(d.privacy || {})
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    languageService.list()
      .then((list) => setLanguageOptions(Array.isArray(list) ? list : []))
      .catch(() => setLanguageOptions([]))
  }, [load])

  const addLanguage = async (e) => {
    e.preventDefault()
    if (!newLanguageId || languageBusy) return
    setLanguageBusy(true)
    setError('')
    try {
      await profileService.addLanguage(Number(newLanguageId), 'conversational', false)
      const opt = languageOptions.find((l) => String(l.id) === String(newLanguageId))
      setLanguages((prev) => [...prev, { languageId: Number(newLanguageId), name: opt?.name, code: opt?.code, proficiency: 'conversational', primary: false }])
      setNewLanguageId('')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLanguageBusy(false)
    }
  }

  const removeLanguage = async (languageId) => {
    setLanguageBusy(true)
    setError('')
    try {
      await profileService.removeLanguage(languageId)
      setLanguages((prev) => prev.filter((l) => l.languageId !== languageId))
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLanguageBusy(false)
    }
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    try {
      await profileService.update(form)
      if (Object.keys(privacy).length) await profileService.updatePrivacy(privacy)
      setNotice('Settings saved.')
      refreshUser?.()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await uploadService.upload(file)
      const url = res?.filename ? uploadService.fileUrl(res.filename) : res?.url
      if (url) {
        await profileService.setProfilePicture(url)
        setNotice('Profile picture updated.')
        load()
      }
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const addInterest = async (e) => {
    e.preventDefault()
    const value = newInterest.trim()
    if (!value || interestBusy) return
    setInterestBusy(true)
    setError('')
    try {
      await profileService.addInterest(value)
      setInterests((prev) => (prev.includes(value) ? prev : [...prev, value]))
      setNewInterest('')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setInterestBusy(false)
    }
  }

  const removeInterest = async (interest) => {
    setInterestBusy(true)
    setError('')
    try {
      await profileService.removeInterest(interest)
      setInterests((prev) => prev.filter((i) => i !== interest))
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setInterestBusy(false)
    }
  }

  const deactivate = async () => {
    if (!window.confirm('Deactivate your account? You will be signed out and your profile hidden.')) return
    setDeactivating(true)
    try {
      await profileService.deactivate()
      await logout()
      navigate('/')
    } catch (err) {
      setError(errorMessage(err))
      setDeactivating(false)
    }
  }

  if (loading) return <LoadingState />

  const name = [form.firstName, form.lastName].filter(Boolean).join(' ') || user?.email || ''

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Settings" description="Manage your profile, privacy and account." />

      {notice && <p className="mb-4 rounded-lg border border-success/30 bg-success/5 px-4 py-3 text-sm text-success" role="status">{notice}</p>}
      {error && <div className="mb-4"><ErrorState message={error} /></div>}

      <form onSubmit={save} className="space-y-6">
        <section className="card flex items-center gap-4 p-6">
          <Avatar name={name} src={profile?.profilePictureUrl} size="lg" />
          <div>
            <label className="btn-outline btn-sm cursor-pointer">
              Change photo
              <input type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
            </label>
            <p className="mt-1 text-xs text-ink-3">JPG or PNG</p>
          </div>
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold">Profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="st-fname" className="label">First name</label>
              <input id="st-fname" className="input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
            <div><label htmlFor="st-lname" className="label">Last name</label>
              <input id="st-lname" className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
          </div>
          <div><label htmlFor="st-bio" className="label">Bio</label>
            <textarea id="st-bio" rows={3} className="input resize-y" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label htmlFor="st-city" className="label">Current city</label>
              <input id="st-city" className="input" value={form.currentCity} onChange={(e) => setForm({ ...form, currentCity: e.target.value })} /></div>
            <div><label htmlFor="st-hcity" className="label">Hometown city</label>
              <input id="st-hcity" className="input" value={form.hometownCity} onChange={(e) => setForm({ ...form, hometownCity: e.target.value })} /></div>
            <div><label htmlFor="st-hcountry" className="label">Hometown country</label>
              <input id="st-hcountry" className="input" value={form.hometownCountry} onChange={(e) => setForm({ ...form, hometownCountry: e.target.value })} /></div>
          </div>
        </section>

        <section className="card space-y-3 p-6">
          <h2 className="font-display text-lg font-semibold">Interests</h2>
          {interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {interests.map((i) => (
                <span key={i} className="chip">
                  {i}
                  <button
                    type="button"
                    onClick={() => removeInterest(i)}
                    disabled={interestBusy}
                    className="ml-1.5 text-ink-3 hover:text-danger"
                    aria-label={`Remove interest ${i}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <form onSubmit={addInterest} className="flex gap-2">
            <input
              className="input"
              placeholder="Add an interest (e.g. Photography)"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              maxLength={50}
              aria-label="New interest"
            />
            <button type="submit" className="btn-outline btn-sm whitespace-nowrap" disabled={interestBusy || !newInterest.trim()}>
              Add
            </button>
          </form>
        </section>

        <section className="card space-y-3 p-6">
          <h2 className="font-display text-lg font-semibold">Languages</h2>
          {languages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {languages.map((l) => (
                <span key={l.languageId} className="chip">
                  {l.name}{l.proficiency ? ` · ${l.proficiency}` : ''}{l.primary ? ' ★' : ''}
                  <button
                    type="button"
                    onClick={() => removeLanguage(l.languageId)}
                    disabled={languageBusy}
                    className="ml-1.5 text-ink-3 hover:text-danger"
                    aria-label={`Remove language ${l.name}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <form onSubmit={addLanguage} className="flex gap-2">
            <select
              className="input"
              value={newLanguageId}
              onChange={(e) => setNewLanguageId(e.target.value)}
              aria-label="Add a language"
            >
              <option value="">Add a language…</option>
              {languageOptions
                .filter((l) => !languages.some((x) => x.languageId === l.id))
                .map((l) => (
                  <option key={l.id} value={l.id}>{l.name}{l.nativeName ? ` (${l.nativeName})` : ''}</option>
                ))}
            </select>
            <button type="submit" className="btn-outline btn-sm whitespace-nowrap" disabled={languageBusy || !newLanguageId}>
              Add
            </button>
          </form>
        </section>

        <section className="card space-y-3 p-6">
          <h2 className="font-display text-lg font-semibold">Privacy</h2>
          {PRIVACY_FIELDS.map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center gap-3 rounded-lg border border-line px-4 py-3 hover:bg-hover">
              <input
                type="checkbox"
                checked={Boolean(privacy[key])}
                onChange={(e) => setPrivacy({ ...privacy, [key]: e.target.checked })}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </section>

        <div className="flex items-center justify-between">
          <button type="button" className="btn-danger btn-sm" onClick={deactivate} disabled={deactivating}>
            {deactivating ? 'Deactivating…' : 'Deactivate account'}
          </button>
          <button type="submit" className="btn-accent" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
