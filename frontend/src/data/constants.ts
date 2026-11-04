import type { MotherTongue } from '@/types'

export const BRAND = {
  name: 'Connect',
  project: 'Project Connect',
  city: 'Gurugram',
  state: 'Haryana',
}

export const LANGUAGES: MotherTongue[] = [
  'Tamil',
  'Telugu',
  'Malayalam',
  'Kannada',
  'Hindi',
  'Marathi',
  'Bengali',
  'Odia',
  'Punjabi',
  'Gujarati',
]

export const ALL_LANGUAGES: (MotherTongue | 'Other')[] = [...LANGUAGES, 'Other']

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
]

export const LOCALITIES = [
  'Cyber City',
  'DLF Phase 2',
  'DLF Phase 1',
  'MG Road',
  'IFFCO Chowk',
  'Huda City Centre',
  'Sector 29',
  'Sector 14',
  'Golf Course Road',
  'Sohna Road',
  'Udyog Vihar',
  'Palam Vihar',
  'South City',
  'Sector 56',
  'Sector 45',
]

export const RADIUS_OPTIONS = [
  { label: '100 metres', metres: 100 },
  { label: '500 metres', metres: 500 },
  { label: '1 kilometre', metres: 1000 },
  { label: '3 kilometres', metres: 3000 },
  { label: '5 kilometres', metres: 5000 },
]

export const STATES = [
  'Tamil Nadu',
  'Andhra Pradesh',
  'Telangana',
  'Kerala',
  'Karnataka',
  'Maharashtra',
  'West Bengal',
  'Odisha',
  'Punjab',
  'Gujarat',
  'Uttar Pradesh',
  'Rajasthan',
  'Madhya Pradesh',
  'Delhi',
  'Haryana',
]

export const HOMETOWNS: Record<string, string[]> = {
  'Tamil Nadu': ['Tenkasi', 'Tirunelveli', 'Madurai', 'Coimbatore', 'Chennai', 'Salem', 'Tiruchirappalli'],
  'Andhra Pradesh': ['Vijayawada', 'Visakhapatnam', 'Guntur', 'Tirupati'],
  Telangana: ['Hyderabad', 'Warangal', 'Karimnagar'],
  Kerala: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'],
  Karnataka: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi'],
  Maharashtra: ['Pune', 'Nagpur', 'Nashik', 'Mumbai'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'],
  Odisha: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri'],
  Punjab: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Noida'],
  Rajasthan: ['Jaipur', 'Udaipur', 'Jodhpur'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior'],
  Delhi: ['Delhi'],
  Haryana: ['Gurugram', 'Faridabad', 'Panipat'],
}

export const DISTRICTS: Record<string, string> = {
  Tenkasi: 'Tenkasi',
  Tirunelveli: 'Tirunelveli',
  Madurai: 'Madurai',
  Coimbatore: 'Coimbatore',
  Chennai: 'Chennai',
  Salem: 'Salem',
  Tiruchirappalli: 'Tiruchirappalli',
  Vijayawada: 'NTR',
  Visakhapatnam: 'Visakhapatnam',
  Guntur: 'Guntur',
  Tirupati: 'Tirupati',
  Hyderabad: 'Hyderabad',
  Warangal: 'Warangal',
  Karimnagar: 'Karimnagar',
  Kochi: 'Ernakulam',
  Thiruvananthapuram: 'Thiruvananthapuram',
  Kozhikode: 'Kozhikode',
  Thrissur: 'Thrissur',
  Bengaluru: 'Bengaluru Urban',
  Mysuru: 'Mysuru',
  Mangaluru: 'Dakshina Kannada',
  Hubballi: 'Dharwad',
  Pune: 'Pune',
  Nagpur: 'Nagpur',
  Nashik: 'Nashik',
  Mumbai: 'Mumbai',
  Kolkata: 'Kolkata',
  Howrah: 'Howrah',
  Durgapur: 'Paschim Bardhaman',
  Siliguri: 'Darjeeling',
  Bhubaneswar: 'Khordha',
  Cuttack: 'Cuttack',
  Rourkela: 'Sundargarh',
  Puri: 'Puri',
  Amritsar: 'Amritsar',
  Ludhiana: 'Ludhiana',
  Jalandhar: 'Jalandhar',
  Patiala: 'Patiala',
  Ahmedabad: 'Ahmedabad',
  Surat: 'Surat',
  Vadodara: 'Vadodara',
  Rajkot: 'Rajkot',
  Lucknow: 'Lucknow',
  Kanpur: 'Kanpur Nagar',
  Varanasi: 'Varanasi',
  Noida: 'Gautam Buddha Nagar',
  Jaipur: 'Jaipur',
  Udaipur: 'Udaipur',
  Jodhpur: 'Jodhpur',
  Bhopal: 'Bhopal',
  Indore: 'Indore',
  Gwalior: 'Gwalior',
  Delhi: 'New Delhi',
  Gurugram: 'Gurugram',
  Faridabad: 'Faridabad',
  Panipat: 'Panipat',
}

export const DEMO_EMAIL = 'demo@connect.in'
export const DEMO_PASSWORD = 'demo123'
export const ADMIN_EMAIL = 'admin@connect.in'
export const ADMIN_PASSWORD = 'admin123'
export const STORAGE_KEY = 'project-connect-v1'
export const SEED_VERSION = 1
