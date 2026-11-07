import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { INTEREST_OPTIONS, ROUTES } from '@/utils/constants';
import { cn } from '@/utils/helpers';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import Input, { Textarea } from '@/components/common/Input';
import Loader from '@/components/common/Loader';
import LanguageSelector from '@/components/shared/LanguageSelector';
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
const selectClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const emptyForm = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  bio: '',
  hometownCity: '',
  hometownCountry: '',
  currentCity: '',
  currentCountry: '',
  latitude: '',
  longitude: '',
  shareExactLocation: false,
  languageIds: [],
  interests: []
};

/** Editable form for the signed-in user's own profile. */
export default function EditProfilePage() {
  const {
    user,
    isLoading,
    updateProfile
  } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    if (!user) return;
    const {
      profile
    } = user;
    setForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      dateOfBirth: profile.dateOfBirth ?? '',
      gender: profile.gender ?? '',
      bio: profile.bio ?? '',
      hometownCity: profile.hometownCity ?? '',
      hometownCountry: profile.hometownCountry ?? '',
      currentCity: profile.currentCity ?? '',
      currentCountry: profile.currentCountry ?? '',
      latitude: profile.latitude !== undefined ? String(profile.latitude) : '',
      longitude: profile.longitude !== undefined ? String(profile.longitude) : '',
      shareExactLocation: profile.privacy.showExactLocation,
      languageIds: profile.languages.map(entry => entry.languageId),
      interests: profile.interests
    });
  }, [user]);
  const update = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
    setIsSaved(false);
  };
  const toggleInterest = interest => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) ? prev.interests.filter(item => item !== interest) : [...prev.interests, interest]
    }));
    setIsSaved(false);
  };
  const buildLanguages = () => {
    const existing = user?.profile.languages ?? [];
    const next = form.languageIds.map(languageId => {
      const match = existing.find(entry => entry.languageId === languageId);
      return match ? {
        ...match
      } : {
        languageId,
        proficiency: 'INTERMEDIATE',
        isPrimary: false
      };
    });
    if (next.length > 0 && !next.some(entry => entry.isPrimary)) {
      next[0] = {
        ...next[0],
        isPrimary: true
      };
    }
    return next;
  };
  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        bio: form.bio.trim() || undefined,
        hometownCity: form.hometownCity.trim() || undefined,
        hometownCountry: form.hometownCountry.trim() || undefined,
        currentCity: form.currentCity.trim() || undefined,
        currentCountry: form.currentCountry.trim() || undefined,
        latitude: form.latitude ? Number(form.latitude) : undefined,
        longitude: form.longitude ? Number(form.longitude) : undefined,
        interests: form.interests,
        languages: buildLanguages(),
        privacy: {
          ...user.profile.privacy,
          showExactLocation: form.shareExactLocation
        }
      });
      setIsSaved(true);
    } finally {
      setIsSaving(false);
    }
  };
  if (isLoading) {
    return <Loader fullScreen label="Loading your profile…" />;
  }
  if (!user) {
    return <EmptyState title="Sign in required" description="Please sign in to edit your profile." action={<Link to={ROUTES.login}>
            <Button>Go to sign in</Button>
          </Link>} />;
  }
  return <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="page-title">Edit profile</h1>
        <Link to={ROUTES.profile} className="text-sm font-medium text-brand-700 hover:underline">
          Back to profile
        </Link>
      </div>

      {isSaved && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Profile saved successfully.
        </div>}

      <section className="card space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Basics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="First name" value={form.firstName} onChange={event => update('firstName', event.target.value)} />
          <Input label="Last name" value={form.lastName} onChange={event => update('lastName', event.target.value)} />
          <Input label="Date of birth" type="date" value={form.dateOfBirth} onChange={event => update('dateOfBirth', event.target.value)} />
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Gender</label>
            <select className={selectClass} value={form.gender} onChange={event => update('gender', event.target.value)}>
              <option value="">Not specified</option>
              {GENDER_OPTIONS.map(option => <option key={option.value} value={option.value}>
                  {option.label}
                </option>)}
            </select>
          </div>
        </div>
        <Textarea label="Bio" value={form.bio} onChange={event => update('bio', event.target.value)} rows={3} placeholder="Tell people a little about yourself" />
      </section>

      <section className="card space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Location</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Hometown city" value={form.hometownCity} onChange={event => update('hometownCity', event.target.value)} />
          <Input label="Hometown country" value={form.hometownCountry} onChange={event => update('hometownCountry', event.target.value)} />
          <Input label="Current city" value={form.currentCity} onChange={event => update('currentCity', event.target.value)} />
          <Input label="Current country" value={form.currentCountry} onChange={event => update('currentCountry', event.target.value)} />
          <Input label="Latitude" type="number" step="any" value={form.latitude} onChange={event => update('latitude', event.target.value)} />
          <Input label="Longitude" type="number" step="any" value={form.longitude} onChange={event => update('longitude', event.target.value)} />
        </div>
        <label className="flex items-start gap-3 text-sm text-slate-700">
          <input type="checkbox" checked={form.shareExactLocation} onChange={event => update('shareExactLocation', event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          <span>
            Share my exact location with connections
            <span className="block text-xs text-slate-500">
              When off, your location is only ever shown approximately.
            </span>
          </span>
        </label>
      </section>

      <section className="card space-y-4">
        <LanguageSelector selectedIds={form.languageIds} onChange={ids => update('languageIds', ids)} label="Languages you speak" hint="Select every language you are comfortable using." />
      </section>

      <section className="card space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map(interest => {
          const active = form.interests.includes(interest);
          return <button key={interest} type="button" onClick={() => toggleInterest(interest)} className={cn('rounded-full border px-3 py-1 text-sm transition', active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50')}>
                {interest}
              </button>;
        })}
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={() => navigate(ROUTES.profile)} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={() => void handleSave()} isLoading={isSaving}>
          Save changes
        </Button>
      </div>
    </div>;
}
