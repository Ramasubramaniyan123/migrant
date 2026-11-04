import React from 'react';
import { INTERESTS } from '@/data/constants';

interface InterestsStepProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
}

export const InterestsStep: React.FC<InterestsStepProps> = ({
  selectedInterests,
  onChange,
}) => {
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      onChange(selectedInterests.filter((i) => i !== interest));
    } else {
      onChange([...selectedInterests, interest]);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Your Interests & Hobbies</h2>
        <p className="text-xs text-gray-500 mt-1">
          Pick a few topics to help you discover friends with similar passions.
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {INTERESTS.map((interest) => {
          const isSelected = selectedInterests.includes(interest);
          return (
            <button
              type="button"
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {interest} {isSelected ? '✓' : '+'}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-400">
        Selected: {selectedInterests.length} {selectedInterests.length === 1 ? 'interest' : 'interests'}
      </p>
    </div>
  );
};
