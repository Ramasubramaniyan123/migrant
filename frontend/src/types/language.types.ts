import type { LanguageProficiency } from './user.types';

export interface Language {
  id: string;
  name: string;
  code: string;
  nativeName?: string;
  proficiency?: LanguageProficiency;
}

export interface UserLanguage {
  userId: string;
  languageId: string;
  proficiency: LanguageProficiency;
  isPrimary?: boolean;
}
