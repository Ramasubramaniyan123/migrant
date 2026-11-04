export type MotherTongue =
  | 'Tamil'
  | 'Telugu'
  | 'Malayalam'
  | 'Kannada'
  | 'Hindi'
  | 'Marathi'
  | 'Bengali'
  | 'Odia'
  | 'Punjabi'
  | 'Gujarati'
  | 'Other';

export type LanguageProficiency = 'basic' | 'intermediate' | 'advanced' | 'native';

export type Gender = 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';

export type LivingSituation = 'PG' | 'Hostel' | 'Rented Apartment' | 'Own House';

export type UserRole = 'user' | 'admin';

export interface IndianLocation {
  city: string;
  state: string;
  district?: string;
  locality?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

export type Location = IndianLocation;

export interface SpokenLanguage {
  id?: string;
  name: string;
  code: string;
  nativeName?: string;
  proficiency: LanguageProficiency;
}

export interface PrivacySettings {
  profileVisibility: 'everyone' | 'connections' | 'same-language';
  showDateOfBirth: boolean;
  showHometown: boolean;
  showExactLocality: boolean;
  showProfession: boolean;
  appearInDiscovery: boolean;
  appearInHometownSearch: boolean;
  showDistance: boolean;
  locationAccuracy: 'exact' | 'general' | 'city-only';
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  name?: string;
  avatar: string;
  photo?: string;
  bio: string;
  dateOfBirth?: string;
  dob?: string;
  age?: number;
  gender?: Gender;
  profession: string;
  currentLocation: IndianLocation;
  currentCity?: string;
  hometown: IndianLocation;
  homeState?: string;
  district?: string;
  locality?: string;
  motherTongue: MotherTongue;
  additionalLanguages: SpokenLanguage[];
  languages?: string[];
  interests: string[];
  livingSituation?: LivingSituation;
  role: UserRole;
  joinedDate: string;
  createdAt: string;
  updatedAt: string;
  distanceFromCurrentUser?: number;
  approximateDistance?: string;
  privacySettings: PrivacySettings;
  privacy?: {
    profileVisibility: 'public' | 'private' | 'connections';
    locationVisibility: 'exact' | 'approximate' | 'hidden';
    pauseDiscovery: boolean;
  };
  connectionCount?: number;
  postCount?: number;
  isOnline?: boolean;
  onboardingComplete?: boolean;
  joinedCommunityIds?: string[];
}

export interface OnboardingData {
  profilePhoto?: string;
  fullName: string;
  dateOfBirth?: string;
  age?: number;
  gender?: Gender;
  bio: string;
  profession: string;
  motherTongue: MotherTongue;
  additionalLanguages: SpokenLanguage[];
  hometown: IndianLocation;
  currentLocation: IndianLocation;
  livingSituation?: LivingSituation;
  interests: string[];
  completedSteps: number;
  isComplete: boolean;
}

export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  ageConfirmed?: boolean;
  termsAccepted?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profession?: string;
  dateOfBirth?: string;
  gender?: Gender;
  motherTongue?: MotherTongue;
  additionalLanguages?: SpokenLanguage[];
  hometown?: IndianLocation;
  currentLocation?: IndianLocation;
  interests?: string[];
  avatar?: string;
}

export interface UserCardData {
  id: string;
  fullName: string;
  avatar: string;
  motherTongue: MotherTongue;
  hometown: string;
  profession: string;
  approximateDistance: string;
  sharedInterests: string[];
  connectionStatus: 'not-connected' | 'pending-sent' | 'pending-received' | 'connected';
  isOnline: boolean;
}
