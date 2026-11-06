import type { PlatformUser, UserActivityEntry } from '@/types/user.types'

const daysAgo = (n: number, hour = 10): string => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(hour, Math.floor(Math.random() * 50), 0, 0)
  return d.toISOString()
}

export const MOCK_USERS: PlatformUser[] = [
  {
    id: 'usr-001', fullName: 'Arun Krishnan', email: 'arun.k@example.com', phone: '+91 98110 22334',
    avatarUrl: 'https://i.pravatar.cc/150?u=usr-001', status: 'ACTIVE', isVerified: true,
    hometown: 'Tenkasi', hometownState: 'Tamil Nadu', currentCity: 'Gurugram', currentLocality: 'Cyber City',
    motherTongue: 'Tamil', languages: ['Tamil', 'English', 'Hindi'], occupation: 'Software Engineer',
    joinedAt: daysAgo(420), lastActiveAt: daysAgo(0, 8),
  },
  {
    id: 'usr-002', fullName: 'Priya Raghavan', email: 'priya.r@example.com', phone: '+91 98220 33445',
    avatarUrl: 'https://i.pravatar.cc/150?u=usr-002', status: 'ACTIVE', isVerified: true,
    hometown: 'Madurai', hometownState: 'Tamil Nadu', currentCity: 'Gurugram', currentLocality: 'DLF Phase 2',
    motherTongue: 'Tamil', languages: ['Tamil', 'English'], occupation: 'Product Manager',
    joinedAt: daysAgo(380), lastActiveAt: daysAgo(0, 9),
  },
  {
    id: 'usr-003', fullName: 'Mohammed Faisal', email: 'faisal.m@example.com', phone: '+91 98330 44556',
    avatarUrl: 'https://i.pravatar.cc/150?u=usr-003', status: 'ACTIVE', isVerified: true,
    hometown: 'Kozhikode', hometownState: 'Kerala', currentCity: 'Bengaluru', currentLocality: 'Indiranagar',
    motherTongue: 'Malayalam', languages: ['Malayalam', 'English', 'Hindi', 'Arabic'], occupation: 'Data Analyst',
    joinedAt: daysAgo(510), lastActiveAt: daysAgo(1, 21),
  },
  {
    id: 'usr-004', fullName: 'Ananya Deshpande', email: 'ananya.d@example.com', phone: '+91 98440 55667',
    avatarUrl: 'https://i.pravatar.cc/150?u=usr-004', status: 'ACTIVE', isVerified: false,
    hometown: 'Pune', hometownState: 'Maharashtra', currentCity: 'Mumbai', currentLocality: 'Andheri West',
    motherTongue: 'Marathi', languages: ['Marathi', 'English', 'Hindi'], occupation: 'UX Designer',
    joinedAt: daysAgo(65), lastActiveAt: daysAgo(0, 7),
  },
  {
    id: 'usr-005', fullName: 'Rohit Yadav', email: 'rohit.y@example.com', phone: '+91 98550 66778',
    avatarUrl: 'https://i.pravatar.cc/150?u=usr-005', status: 'SUSPENDED', isVerified: true,
    hometown: 'Lucknow', hometownState: 'Uttar Pradesh', currentCity: 'Noida', currentLocality: 'Sector 62',
    motherTongue: 'Hindi', languages: ['Hindi', 'English'], occupation: 'Sales Executive',
    joinedAt: daysAgo(300), lastActiveAt: daysAgo(12, 14),
  },
  {
    id: 'usr-006', fullName: 'Deepika Menon', email: 'deepika.m@example.com', phone: '+91 98660 77889',
    avatarUrl: 'https://i.pravatar.cc/150?u=usr-006', status: 'ACTIVE', isVerified: true,
    hometown: 'Kochi', hometownState: 'Kerala', currentCity: 'Chennai', currentLocality: 'OMR',
    motherTongue: 'Malayalam', languages: ['Malayalam', 'Tamil', 'English'], occupation: 'Nurse',
    joinedAt: daysAgo(240), lastActiveAt: daysAgo(0, 6),
  },
  {
    id: 'usr-007', fullName: 'Suresh Reddy', email: 'suresh.r@example.com', status: 'PENDING_VERIFICATION',
    isVerified: false, hometown: 'Visakhapatnam', hometownState: 'Andhra Pradesh',
    currentCity: 'Hyderabad', currentLocality: 'Madhapur', motherTongue: 'Telugu',
    languages: ['Telugu', 'English', 'Hindi'], occupation: 'Civil Engineer',
    joinedAt: daysAgo(3), lastActiveAt: daysAgo(0, 10),
  },
  {
    id: 'usr-008', fullName: 'Fatima Sheikh', email: 'fatima.s@example.com', phone: '+91 98770 88990',
    avatarUrl: 'https://i.pravatar.cc/150?u=usr-008', status: 'ACTIVE', isVerified: true,
    hometown: 'Aurangabad', hometownState: 'Maharashtra', currentCity: 'Pune', currentLocality: 'Baner',
    motherTongue: 'Marathi', languages: ['Marathi', 'Hindi', 'Urdu', 'English'], occupation: 'Teacher',
    joinedAt: daysAgo(190), lastActiveAt: daysAgo(2, 18),
  },
  {
    id: 'usr-009', fullName: 'Vikram Joshi', email: 'vikram.j@example.com', phone: '+91 98880 99001',
    avatarUrl: 'https://i.pravatar.cc/150?u=usr-009', status: 'ACTIVE', isVerified: true,
    hometown: 'Ahmedabad', hometownState: 'Gujarat', currentCity: 'Ahmedabad', currentLocality: 'Satellite',
    motherTongue: 'Gujarati', languages: ['Gujarati', 'Hindi', 'English'], occupation: 'CA',
    joinedAt: daysAgo(450), lastActiveAt: daysAgo(0, 11),
  },
  {
    id: 'usr-010', fullName: 'Meera Pillai', email: 'meera.p@example.com', phone: '+91 98990 00112',
    avatarUrl: 'https://i.pravatar.cc/150?u=usr-010', status: 'DEACTIVATED', isVerified: true,
    hometown: 'Thrissur', hometownState: 'Kerala', currentCity: 'Kochi', currentLocality: 'Kakkanad',
    motherTongue: 'Malayalam', languages: ['Malayalam', 'English'], occupation: 'HR Manager',
    joinedAt: daysAgo(600), lastActiveAt: daysAgo(45, 12),
  },
  {
    id: 'usr-011', fullName: 'Imran Khan', email: 'imran.k@example.com', phone: '+91 99001 11223',
    avatarUrl: 'https://i.pravatar.cc/150?u=usr-011', status: 'ACTIVE', isVerified: true,
    hometown: 'Srinagar', hometownState: 'Jammu & Kashmir', currentCity: 'Delhi', currentLocality: 'Lajpat Nagar',
    motherTongue: 'Kashmiri', languages: ['Kashmiri', 'Urdu', 'Hindi', 'English'], occupation: 'Journalist',
    joinedAt: daysAgo(150), lastActiveAt: daysAgo(0, 13),
  },
  {
    id: 'usr-012', fullName: 'Lakshmi Narayan', email: 'lakshmi.n@example.com', phone: '+91 99112 22334',
    avatarUrl: 'https://i.pravatar.cc/150?u=usr-012', status: 'ACTIVE', isVerified: false,
    hometown: 'Mysuru', hometownState: 'Karnataka', currentCity: 'Bengaluru', currentLocality: 'Whitefield',
    motherTongue: 'Kannada', languages: ['Kannada', 'English', 'Hindi'], occupation: 'Researcher',
    joinedAt: daysAgo(22), lastActiveAt: daysAgo(0, 15),
  },
]

export const MOCK_USER_ACTIVITY: UserActivityEntry[] = [
  { id: 'act-001', userId: 'usr-001', type: 'LOGIN', description: 'Logged in from Chrome on Android', createdAt: daysAgo(0, 8) },
  { id: 'act-002', userId: 'usr-001', type: 'POST', description: 'Created post in "Tamil Nadu Migrants – Gurugram"', createdAt: daysAgo(0, 8) },
  { id: 'act-003', userId: 'usr-001', type: 'CONNECTION', description: 'Sent connection request to Priya Raghavan', createdAt: daysAgo(0, 7) },
  { id: 'act-004', userId: 'usr-001', type: 'COMMUNITY_JOIN', description: 'Joined community "Tamil Food & Festivities"', createdAt: daysAgo(1, 20) },
  { id: 'act-005', userId: 'usr-001', type: 'MESSAGE', description: 'Sent 4 messages in "Arun ↔ Priya" conversation', createdAt: daysAgo(1, 19) },
  { id: 'act-006', userId: 'usr-001', type: 'PROFILE_UPDATE', description: 'Updated profile photo and occupation', createdAt: daysAgo(3, 12) },
  { id: 'act-007', userId: 'usr-001', type: 'LOGIN', description: 'Logged in from Safari on iPhone', createdAt: daysAgo(5, 9) },
]
