import React, { useState } from 'react';
import { Shield, Eye, MapPin, Check } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import type { PrivacySettings as PrivacySettingsType } from '@/types';

export const PrivacySettings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState<PrivacySettingsType>(
    user?.privacySettings || {
      profileVisibility: 'everyone',
      showDateOfBirth: false,
      showHometown: true,
      showExactLocality: true,
      showProfession: true,
      appearInDiscovery: true,
      appearInHometownSearch: true,
      showDistance: true,
      locationAccuracy: 'exact',
    }
  );

  const handleToggle = (key: keyof PrivacySettingsType) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
  };

  const handleSave = () => {
    if (user) {
      updateUser({ privacySettings: settings });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-indigo-600" />
          Location & Profile Privacy Controls
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Your physical security and privacy are paramount. We never expose your exact home GPS.
        </p>
      </div>

      {/* Visibility level */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          Profile Visibility
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { value: 'everyone', label: 'Everyone in City', desc: 'Visible to all verified migrants in Gurugram' },
            { value: 'connections', label: 'My Connections', desc: 'Only approved connections can see full profile' },
            { value: 'same-language', label: 'Same Mother Tongue', desc: 'Only users speaking your native language' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setSettings({ ...settings, profileVisibility: opt.value as any });
                setSaved(false);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                settings.profileVisibility === opt.value
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-200'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-semibold text-xs">{opt.label}</div>
              <div className="text-[11px] text-gray-500 mt-1 leading-normal">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Location accuracy */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          Location Precision
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {[
            { value: 'exact', label: 'Locality Level', desc: 'e.g. Cyber City or DLF Phase 2' },
            { value: 'general', label: 'Approximate Ring', desc: 'Shows rough 3km radius only' },
            { value: 'city-only', label: 'City Only', desc: 'Only shows "Gurugram, Haryana"' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setSettings({ ...settings, locationAccuracy: opt.value as any });
                setSaved(false);
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                settings.locationAccuracy === opt.value
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold ring-1 ring-indigo-300'
                  : 'border-gray-200 text-gray-700'
              }`}
            >
              <div>{opt.label}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          Discovery Preferences
        </label>

        {[
          { key: 'appearInDiscovery' as const, label: 'Appear in General People Discovery', desc: 'Allow nearby migrants to see you in their search results' },
          { key: 'appearInHometownSearch' as const, label: 'Appear in Hometown Origin Matches', desc: 'Let folks from your state or city find you' },
          { key: 'showDistance' as const, label: 'Display Approximate Distance', desc: 'Show e.g. "1.2 km away" on cards' },
          { key: 'showHometown' as const, label: 'Display Hometown on Cards', desc: 'Show your origin city & district' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <div>
              <p className="text-xs font-bold text-gray-900">{item.label}</p>
              <p className="text-[11px] text-gray-500">{item.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle(item.key)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings[item.key] ? 'bg-indigo-600 justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        {saved ? (
          <span className="text-xs text-emerald-600 font-semibold flex items-center">
            <Check className="w-4 h-4 mr-1" />
            Privacy settings updated!
          </span>
        ) : (
          <span />
        )}
        <Button onClick={handleSave} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
          Save Privacy Settings
        </Button>
      </div>
    </div>
  );
};

