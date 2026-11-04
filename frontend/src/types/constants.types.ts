// Indian States
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Puducherry',
  'Jammu and Kashmir',
  'Ladakh',
] as const;

export type IndianState = typeof INDIAN_STATES[number];

// Gurugram Localities
export const GURUGRAM_LOCALITIES = [
  'Cyber City',
  'DLF Phase 1',
  'DLF Phase 2',
  'DLF Phase 3',
  'DLF Phase 4',
  'DLF Phase 5',
  'Golf Course Road',
  'Golf Course Extension Road',
  'Sohna Road',
  'MG Road',
  'Udyog Vihar Phase 1',
  'Udyog Vihar Phase 2',
  'Udyog Vihar Phase 3',
  'Udyog Vihar Phase 4',
  'Udyog Vihar Phase 5',
  'Sector 14',
  'Sector 15',
  'Sector 28',
  'Sector 29',
  'Sector 43',
  'Sector 44',
  'Sector 45',
  'Sector 54',
  'Sector 55',
  'Sector 56',
  'Palam Vihar',
  'South City 1',
  'South City 2',
  'Nirvana Country',
  'Ardee City',
] as const;

export type GurgaonLocality = typeof GURUGRAM_LOCALITIES[number];

// Languages
export const LANGUAGES = [
  {
    name: 'Tamil',
    code: 'ta',
    nativeName: 'தமிழ்',
  },
  {
    name: 'Telugu',
    code: 'te',
    nativeName: 'తెలుగు',
  },
  {
    name: 'Malayalam',
    code: 'ml',
    nativeName: 'മലയാളം',
  },
  {
    name: 'Kannada',
    code: 'kn',
    nativeName: 'ಕನ್ನಡ',
  },
  {
    name: 'Hindi',
    code: 'hi',
    nativeName: 'हिन्दी',
  },
  {
    name: 'Marathi',
    code: 'mr',
    nativeName: 'मराठी',
  },
  {
    name: 'Bengali',
    code: 'bn',
    nativeName: 'বাংলা',
  },
  {
    name: 'Odia',
    code: 'or',
    nativeName: 'ଓଡ଼ିଆ',
  },
  {
    name: 'Punjabi',
    code: 'pa',
    nativeName: 'ਪੰਜਾਬੀ',
  },
  {
    name: 'Gujarati',
    code: 'gu',
    nativeName: 'ગુજરાતી',
  },
  {
    name: 'English',
    code: 'en',
    nativeName: 'English',
  },
  {
    name: 'Other',
    code: 'other',
    nativeName: 'Other',
  },
] as const;

// Interests
export const INTERESTS = [
  'Cricket',
  'Movies',
  'Music',
  'Technology',
  'Travelling',
  'Food',
  'Fitness',
  'Gaming',
  'Reading',
  'Photography',
  'Art',
  'Dance',
  'Cooking',
  'Hiking',
  'Fashion',
  'Yoga',
  'Sports',
  'Volunteering',
] as const;

export type Interest = typeof INTERESTS[number];

// Professions
export const PROFESSIONS = [
  'Software Engineer',
  'Product Manager',
  'Designer',
  'Data Analyst',
  'Data Scientist',
  'Marketing Manager',
  'HR Manager',
  'Sales Manager',
  'Business Analyst',
  'Project Manager',
  'Teacher',
  'Doctor',
  'Nurse',
  'Accountant',
  'Financial Analyst',
  'Consultant',
  'Entrepreneur',
  'Student',
  'Other',
] as const;

export type Profession = typeof PROFESSIONS[number];
