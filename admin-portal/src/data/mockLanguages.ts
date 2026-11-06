import type { Language } from '@/types/language.types'

export const MOCK_LANGUAGES: Language[] = [
  { id: 'lang-01', name: 'Tamil', nativeName: 'தமிழ்', code: 'ta', isActive: true, userCount: 612, communityCount: 14 },
  { id: 'lang-02', name: 'Malayalam', nativeName: 'മലയാളം', code: 'ml', isActive: true, userCount: 488, communityCount: 11 },
  { id: 'lang-03', name: 'Hindi', nativeName: 'हिन्दी', code: 'hi', isActive: true, userCount: 1240, communityCount: 22 },
  { id: 'lang-04', name: 'Telugu', nativeName: 'తెలుగు', code: 'te', isActive: true, userCount: 356, communityCount: 8 },
  { id: 'lang-05', name: 'Marathi', nativeName: 'मराठी', code: 'mr', isActive: true, userCount: 402, communityCount: 9 },
  { id: 'lang-06', name: 'Kannada', nativeName: 'ಕನ್ನಡ', code: 'kn', isActive: true, userCount: 298, communityCount: 7 },
  { id: 'lang-07', name: 'Bengali', nativeName: 'বাংলা', code: 'bn', isActive: true, userCount: 274, communityCount: 6 },
  { id: 'lang-08', name: 'Gujarati', nativeName: 'ગુજરાતી', code: 'gu', isActive: true, userCount: 186, communityCount: 4 },
  { id: 'lang-09', name: 'Urdu', nativeName: 'اردو', code: 'ur', isActive: true, userCount: 230, communityCount: 5 },
  { id: 'lang-10', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', code: 'pa', isActive: false, userCount: 0, communityCount: 0 },
]
