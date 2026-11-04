import React from 'react';
import { LANGUAGES } from '@/data/constants';
import type { MotherTongue } from '@/types';

interface LanguageStepProps {
  motherTongue: MotherTongue;
  additionalLanguages: string[];
  onChange: (fields: { motherTongue?: MotherTongue; additionalLanguages?: string[] }) => void;
}

export const LanguageStep: React.FC<LanguageStepProps> = ({
  motherTongue,
  additionalLanguages,
  onChange,
}) => {
  const toggleAdditional = (lang: string) => {
    if (additionalLanguages.includes(lang)) {
      onChange({ additionalLanguages: additionalLanguages.filter((l) => l !== lang) });
    } else {
      onChange({ additionalLanguages: [...additionalLanguages, lang] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Your Languages</h2>
        <p className="text-xs text-gray-500 mt-1">
          Language is at the core of MigrantConnect. Select your primary tongue and others you speak.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Mother Tongue <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {LANGUAGES.map((lang) => {
            const isSelected = motherTongue === lang;
            return (
              <button
                type="button"
                key={lang}
                onClick={() => onChange({ motherTongue: lang })}
                className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left flex items-center justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-300'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                }`}
              >
                <span>{lang}</span>
                {isSelected && <span className="text-indigo-600 text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Other Languages You Speak
        </label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.filter((l) => l !== motherTongue).concat('English' as any).map((lang) => {
            const isSelected = additionalLanguages.includes(lang);
            return (
              <button
                type="button"
                key={lang}
                onClick={() => toggleAdditional(lang)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'
                }`}
              >
                {lang} {isSelected ? '✕' : '+'}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
