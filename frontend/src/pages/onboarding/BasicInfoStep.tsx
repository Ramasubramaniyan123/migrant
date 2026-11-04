import React from 'react';
import { Input } from '@/components/common/Input';
import { Avatar } from '@/components/common/Avatar';

interface BasicInfoStepProps {
  fullName: string;
  profession: string;
  bio: string;
  dob: string;
  avatar: string;
  onChange: (fields: Partial<{ fullName: string; profession: string; bio: string; dob: string; avatar: string }>) => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  fullName,
  profession,
  bio,
  dob,
  avatar,
  onChange,
}) => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
        <p className="text-xs text-gray-500 mt-1">Tell fellow community members who you are</p>
      </div>

      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <Avatar src={avatar} name={fullName || 'User'} size="xl" />
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">Avatar Preview</label>
          <button
            type="button"
            onClick={() => {
              const seed = Math.random().toString(36).substring(7);
              onChange({ avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}` });
            }}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Generate New Avatar 🎲
          </button>
        </div>
      </div>

      <Input
        label="Full Name"
        value={fullName}
        onChange={(e) => onChange({ fullName: e.target.value })}
        placeholder="e.g. Arun Selvam"
        required
      />

      <Input
        label="Profession / Current Role"
        value={profession}
        onChange={(e) => onChange({ profession: e.target.value })}
        placeholder="e.g. Software Engineer, Designer, Student"
        required
      />

      <Input
        type="date"
        label="Date of Birth"
        value={dob}
        onChange={(e) => onChange({ dob: e.target.value })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Brief Bio</label>
        <textarea
          rows={3}
          value={bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          placeholder="Share where you moved from, your interests, or what brings you to Gurugram..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>
    </div>
  );
};
