import React from 'react';
import { STATES, HOMETOWNS, DISTRICTS } from '@/data/constants';
import { Input } from '@/components/common/Input';

interface HometownStepProps {
  homeState: string;
  hometown: string;
  district: string;
  onChange: (fields: { homeState?: string; hometown?: string; district?: string }) => void;
}

export const HometownStep: React.FC<HometownStepProps> = ({
  homeState,
  hometown,
  district,
  onChange,
}) => {
  const availableCities = HOMETOWNS[homeState] || [];

  const handleStateChange = (newState: string) => {
    const firstCity = HOMETOWNS[newState]?.[0] || '';
    const newDistrict = DISTRICTS[firstCity] || firstCity;
    onChange({ homeState: newState, hometown: firstCity, district: newDistrict });
  };

  const handleCityChange = (newCity: string) => {
    const newDistrict = DISTRICTS[newCity] || newCity;
    onChange({ hometown: newCity, district: newDistrict });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Your Hometown</h2>
        <p className="text-xs text-gray-500 mt-1">
          Connect with others who grew up in the same streets, schools, and districts.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Origin State</label>
        <select
          value={homeState}
          onChange={(e) => handleStateChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Hometown City</label>
        {availableCities.length > 0 ? (
          <select
            value={hometown}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        ) : (
          <Input
            value={hometown}
            onChange={(e) => handleCityChange(e.target.value)}
            placeholder="Enter your hometown city"
          />
        )}
      </div>

      <Input
        label="District"
        value={district}
        onChange={(e) => onChange({ district: e.target.value })}
        placeholder="District name"
      />
    </div>
  );
};
