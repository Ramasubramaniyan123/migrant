import React from 'react';
import { LOCALITIES } from '@/data/constants';
import type { LivingSituation } from '@/types';

interface LocationStepProps {
  currentCity: string;
  locality: string;
  livingSituation: LivingSituation;
  onChange: (fields: { currentCity?: string; locality?: string; livingSituation?: LivingSituation }) => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({
  currentCity,
  locality,
  livingSituation,
  onChange,
}) => {
  const livingOptions: LivingSituation[] = ['PG', 'Hostel', 'Rented Apartment', 'Own House'];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Current Location</h2>
        <p className="text-xs text-gray-500 mt-1">
          Where you are currently residing or working. Proximity is kept private and approximate.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Current City</label>
        <input
          type="text"
          value={currentCity}
          disabled
          className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-700 rounded-lg text-sm cursor-not-allowed font-medium"
        />
        <p className="text-[11px] text-gray-400 mt-1">Prototype pilot currently live in Gurugram (NCR)</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Locality / Sector</label>
        <select
          value={locality}
          onChange={(e) => onChange({ locality: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {LOCALITIES.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Living Situation</label>
        <div className="grid grid-cols-2 gap-2.5">
          {livingOptions.map((option) => {
            const isSelected = livingSituation === option;
            return (
              <button
                type="button"
                key={option}
                onClick={() => onChange({ livingSituation: option })}
                className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-300'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
