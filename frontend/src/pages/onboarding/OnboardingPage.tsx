import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { BasicInfoStep } from './BasicInfoStep';
import { LanguageStep } from './LanguageStep';
import { HometownStep } from './HometownStep';
import { LocationStep } from './LocationStep';
import { InterestsStep } from './InterestsStep';
import { useAuth } from '@/hooks/useAuth';
import { useUserContext } from '@/context/UserContext';
import { ROUTES } from '@/utils/constants';
import type { MotherTongue, LivingSituation } from '@/types';

export const OnboardingPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { updateCurrentUserProfile } = useUserContext();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Form state initialized with user's data or defaults
  const [fullName, setFullName] = useState(user?.fullName || 'Arun Selvam');
  const [profession, setProfession] = useState(user?.profession || 'Software Engineer');
  const [bio, setBio] = useState(user?.bio || '');
  const [dob, setDob] = useState(user?.dateOfBirth || '1998-04-12');
  const [avatar, setAvatar] = useState(
    user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arun'
  );

  const [motherTongue, setMotherTongue] = useState<MotherTongue>(
    (user?.motherTongue as MotherTongue) || 'Tamil'
  );
  const [additionalLanguages, setAdditionalLanguages] = useState<string[]>(
    user?.additionalLanguages?.map((l) => l.name) || ['English', 'Hindi']
  );

  const [homeState, setHomeState] = useState(user?.hometown?.state || 'Tamil Nadu');
  const [hometown, setHometown] = useState(user?.hometown?.city || 'Tenkasi');
  const [district, setDistrict] = useState(user?.hometown?.district || 'Tenkasi');

  const [currentCity] = useState('Gurugram');
  const [locality, setLocality] = useState(user?.currentLocation?.locality || 'Cyber City');
  const [livingSituation, setLivingSituation] = useState<LivingSituation>(
    user?.livingSituation || 'Rented Apartment'
  );

  const [interests, setInterests] = useState<string[]>(
    user?.interests || ['Cricket', 'Technology', 'Food']
  );

  const handleNext = () => setStep((s) => Math.min(5, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleComplete = () => {
    const updatedProfile = {
      fullName,
      firstName: fullName.split(' ')[0] || fullName,
      lastName: fullName.split(' ').slice(1).join(' ') || '',
      profession,
      bio,
      dateOfBirth: dob,
      avatar,
      motherTongue,
      additionalLanguages: additionalLanguages.map((name) => ({
        name,
        code: name.slice(0, 2).toLowerCase(),
        proficiency: 'advanced' as const,
      })),
      languages: [motherTongue, ...additionalLanguages],
      hometown: {
        city: hometown,
        state: homeState,
        district,
      },
      currentLocation: {
        city: currentCity,
        state: 'Haryana',
        locality,
      },
      livingSituation,
      interests,
      onboardingComplete: true,
    };

    updateUser(updatedProfile as any);
    updateCurrentUserProfile(updatedProfile as any);
    navigate(ROUTES.DASHBOARD);
  };

  const stepTitles = [
    'Basic Profile',
    'Native Languages',
    'Hometown Roots',
    'Current Locality',
    'Interests & Hobbies',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/60 to-blue-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="font-extrabold text-2xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            MigrantConnect
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Welcome to the Community</h1>
          <p className="text-xs text-gray-500 mt-1">Complete your quick profile to unlock matching</p>
        </div>

        {/* Stepper bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-600 mb-2">
            <span>Step {step} of 5: {stepTitles[step - 1]}</span>
            <span>{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Card Content */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-gray-100">
          {step === 1 && (
            <BasicInfoStep
              fullName={fullName}
              profession={profession}
              bio={bio}
              dob={dob}
              avatar={avatar}
              onChange={(f) => {
                if (f.fullName !== undefined) setFullName(f.fullName);
                if (f.profession !== undefined) setProfession(f.profession);
                if (f.bio !== undefined) setBio(f.bio);
                if (f.dob !== undefined) setDob(f.dob);
                if (f.avatar !== undefined) setAvatar(f.avatar);
              }}
            />
          )}

          {step === 2 && (
            <LanguageStep
              motherTongue={motherTongue}
              additionalLanguages={additionalLanguages}
              onChange={(f) => {
                if (f.motherTongue) setMotherTongue(f.motherTongue);
                if (f.additionalLanguages) setAdditionalLanguages(f.additionalLanguages);
              }}
            />
          )}

          {step === 3 && (
            <HometownStep
              homeState={homeState}
              hometown={hometown}
              district={district}
              onChange={(f) => {
                if (f.homeState) setHomeState(f.homeState);
                if (f.hometown) setHometown(f.hometown);
                if (f.district) setDistrict(f.district);
              }}
            />
          )}

          {step === 4 && (
            <LocationStep
              currentCity={currentCity}
              locality={locality}
              livingSituation={livingSituation}
              onChange={(f) => {
                if (f.locality) setLocality(f.locality);
                if (f.livingSituation) setLivingSituation(f.livingSituation);
              }}
            />
          )}

          {step === 5 && (
            <InterestsStep
              selectedInterests={interests}
              onChange={(newInterests) => setInterests(newInterests)}
            />
          )}

          {/* Stepper controls */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            {step > 1 ? (
              <Button variant="outline" size="sm" onClick={handleBack}>
                ← Back
              </Button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <Button size="sm" onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700">
                Continue →
              </Button>
            ) : (
              <Button size="sm" onClick={handleComplete} className="bg-emerald-600 hover:bg-emerald-700">
                Complete Setup & Go to Feed 🎉
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
