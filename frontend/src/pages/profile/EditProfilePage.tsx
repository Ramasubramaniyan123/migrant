import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Avatar } from '@/components/common/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { useUserContext } from '@/context/UserContext';
import { LANGUAGES, LOCALITIES } from '@/data/constants';
import { ROUTES } from '@/utils/constants';
import type { MotherTongue, LivingSituation } from '@/types';

export const EditProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { updateCurrentUserProfile } = useUserContext();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.firstName || 'Arun');
  const [lastName, setLastName] = useState(user?.lastName || 'Selvam');
  const [profession, setProfession] = useState(user?.profession || 'Software Engineer');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(
    user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arun'
  );
  const [motherTongue, setMotherTongue] = useState<MotherTongue>(
    (user?.motherTongue as MotherTongue) || 'Tamil'
  );
  const [locality, setLocality] = useState(user?.currentLocation?.locality || 'Cyber City');
  const [livingSituation, setLivingSituation] = useState<LivingSituation>(
    user?.livingSituation || 'Rented Apartment'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      firstName,
      lastName,
      profession,
      bio,
      avatar,
      motherTongue,
      currentLocation: {
        ...(user?.currentLocation || { city: 'Gurugram', state: 'Haryana' }),
        locality,
      },
      livingSituation,
    };

    updateUser(updatedData as any);
    updateCurrentUserProfile(updatedData as any);
    navigate(ROUTES.PROFILE);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to={ROUTES.PROFILE}
        className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Back to Profile
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <h1 className="text-xl font-extrabold text-gray-900 mb-6">Edit Migrant Profile</h1>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Avatar edit */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <Avatar src={avatar} name={`${firstName} ${lastName}`} size="xl" />
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Profile Photo</label>
              <button
                type="button"
                onClick={() => {
                  const seed = Math.random().toString(36).substring(7);
                  setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
                }}
                className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Randomize DiceBear Avatar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <Input
            label="Profession / Job Title"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About You (Bio)</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other migrants about your journey, interests, or background..."
              className="w-full text-sm border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mother Tongue</label>
              <select
                value={motherTongue}
                onChange={(e) => setMotherTongue(e.target.value as MotherTongue)}
                className="w-full text-sm border border-gray-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gurugram Locality</label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Living Situation</label>
            <select
              value={livingSituation}
              onChange={(e) => setLivingSituation(e.target.value as LivingSituation)}
              className="w-full text-sm border border-gray-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="PG">PG</option>
              <option value="Hostel">Hostel</option>
              <option value="Rented Apartment">Rented Apartment</option>
              <option value="Own House">Own House</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
            <Link to={ROUTES.PROFILE}>
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </Link>
            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              <Save className="w-4 h-4 mr-1.5" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

