import React from 'react';
import { clsx } from '@/utils/helpers';
import type { Language } from '@/types';

interface LanguageSelectorProps {
  languages: (Language | string)[];
  selectedLanguages: string[];
  onToggle: (languageIdOrName: string) => void;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  selectedLanguages,
  onToggle,
  className,
}) => {
  return (
    <div className={clsx('flex flex-wrap gap-2', className)}>
      {languages.map((language) => {
        const id = typeof language === 'string' ? language : language.id || language.name;
        const name = typeof language === 'string' ? language : language.name;
        const nativeName = typeof language === 'string' ? undefined : language.nativeName;
        const isSelected = selectedLanguages.includes(id) || selectedLanguages.includes(name);

        return (
          <button
            type="button"
            key={id}
            onClick={() => onToggle(id)}
            className={clsx(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150',
              isSelected
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {name}
            {nativeName && nativeName !== name && (
              <span className="ml-1 text-xs opacity-80">({nativeName})</span>
            )}
          </button>
        );
      })}
    </div>
  );
};
