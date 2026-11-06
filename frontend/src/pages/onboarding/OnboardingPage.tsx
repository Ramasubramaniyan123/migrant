import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
import type { OnboardingFormData, User, UserProfile } from '@/types/user.types'
import { ROUTES } from '@/utils/constants'
import BasicInfoStep from './BasicInfoStep'
import HometownStep from './HometownStep'
import InterestsStep from './InterestsStep'
import LanguageStep from './LanguageStep'
import LocationStep from './LocationStep'

const TOTAL_STEPS = 5
const STEP_TITLES = ['About you', 'Languages', 'Hometown', 'Location', 'Interests']

/** Seeds the wizard from the signed-in user's existing profile where available. */
function buildInitialForm(user: User | null): OnboardingFormData {
  const profile = user?.profile
  const primaryLanguageId = profile?.languages.find((entry) => entry.isPrimary)?.languageId

  return {
    firstName: profile?.firstName ?? '',
    lastName: profile?.lastName ?? '',
    dateOfBirth: profile?.dateOfBirth ?? '',
    gender: profile?.gender ?? '',
    bio: profile?.bio ?? '',
    languageIds: profile?.languages.map((entry) => entry.languageId) ?? [],
    primaryLanguageId,
    hometownCountry: profile?.hometownCountry ?? '',
    hometownCity: profile?.hometownCity ?? '',
    currentCountry: profile?.currentCountry ?? '',
    currentCity: profile?.currentCity ?? '',
    latitude: profile?.latitude,
    longitude: profile?.longitude,
    shareExactLocation: profile?.privacy.showExactLocation ?? false,
    interests: profile?.interests ?? [],
  }
}

/** Minimal per-step requirements used to gate the Next button. */
function isStepValid(step: number, data: OnboardingFormData): boolean {
  switch (step) {
    case 0:
      return Boolean(data.firstName.trim() && data.lastName.trim())
    case 1:
      return data.languageIds.length > 0
    case 2:
      return Boolean(data.hometownCity.trim() && data.hometownCountry.trim())
    case 3:
      return Boolean(data.currentCity.trim() && data.currentCountry.trim())
    case 4:
      return data.interests.length > 0
    default:
      return true
  }
}

/** Multi-step onboarding wizard shown right after registration. */
export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, completeOnboarding } = useAuth()

  const [form, setForm] = useState<OnboardingFormData>(() => buildInitialForm(user))
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user) navigate(ROUTES.login, { replace: true })
  }, [user, navigate])

  const handleChange = useCallback((patch: Partial<OnboardingFormData>) => {
    setForm((current) => ({ ...current, ...patch }))
  }, [])

  const canProceed = isStepValid(step, form)
  const isLastStep = step === TOTAL_STEPS - 1
  const progress = ((step + 1) / TOTAL_STEPS) * 100

  async function handleFinish() {
    if (!user) {
      navigate(ROUTES.login, { replace: true })
      return
    }

    const patch: Partial<UserProfile> = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      dateOfBirth: form.dateOfBirth || undefined,
      gender: form.gender || undefined,
      bio: form.bio.trim() || undefined,
      hometownCity: form.hometownCity.trim(),
      hometownCountry: form.hometownCountry.trim(),
      currentCity: form.currentCity.trim(),
      currentCountry: form.currentCountry.trim(),
      latitude: form.latitude,
      longitude: form.longitude,
      interests: form.interests,
      languages: form.languageIds.map((id) => ({
        languageId: id,
        proficiency: 'INTERMEDIATE',
        isPrimary: id === form.primaryLanguageId,
      })),
      privacy: {
        ...user.profile.privacy,
        showExactLocation: form.shareExactLocation,
      },
    }

    setIsSubmitting(true)
    try {
      await completeOnboarding(patch)
      navigate(ROUTES.dashboard, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleNext() {
    if (isLastStep) {
      void handleFinish()
      return
    }
    setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1))
  }

  function renderStep() {
    switch (step) {
      case 0:
        return <BasicInfoStep data={form} onChange={handleChange} />
      case 1:
        return <LanguageStep data={form} onChange={handleChange} />
      case 2:
        return <HometownStep data={form} onChange={handleChange} />
      case 3:
        return <LocationStep data={form} onChange={handleChange} />
      default:
        return <InterestsStep data={form} onChange={handleChange} />
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <p className="text-sm font-medium text-brand-700">Setting up your profile</p>
        <h1 className="page-title mt-1">Let&apos;s help people find you</h1>
        <p className="muted mt-1">
          Step {step + 1} of {TOTAL_STEPS} · {STEP_TITLES[step]}
        </p>
      </div>

      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="card">{renderStep()}</div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          disabled={step === 0 || isSubmitting}
          onClick={() => setStep((current) => Math.max(current - 1, 0))}
        >
          Back
        </Button>
        <Button
          type="button"
          disabled={!canProceed}
          isLoading={isSubmitting}
          onClick={handleNext}
        >
          {isLastStep ? 'Finish and explore' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
