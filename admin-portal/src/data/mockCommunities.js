export const MOCK_COMMUNITIES = [{
  id: 'com-01',
  name: 'Tamil Nadu Migrants – Gurugram',
  description: 'Connect with fellow Tamils in the NCR. Housing tips, job referrals and weekend meetups.',
  type: 'HOMETOWN',
  hometown: 'Tamil Nadu',
  city: 'Gurugram',
  memberCount: 486,
  postCount: 132,
  isActive: true,
  createdBy: 'usr-001',
  createdAt: '2025-07-14T10:00:00+05:30'
}, {
  id: 'com-02',
  name: 'Malayalam Circle – Bengaluru',
  description: 'Kerala migrants in Bengaluru. Onam celebrations, food exchanges and cultural events.',
  type: 'LANGUAGE',
  language: 'Malayalam',
  city: 'Bengaluru',
  memberCount: 352,
  postCount: 98,
  isActive: true,
  createdBy: 'usr-003',
  createdAt: '2025-08-02T10:00:00+05:30'
}, {
  id: 'com-03',
  name: 'Mumbai Foodies & Housing',
  description: 'Recommendations for affordable stays and authentic regional food across Mumbai suburbs.',
  type: 'INTEREST',
  city: 'Mumbai',
  memberCount: 891,
  postCount: 245,
  isActive: true,
  createdBy: 'usr-008',
  createdAt: '2025-06-20T10:00:00+05:30'
}, {
  id: 'com-04',
  name: 'Hyderabad Tech Professionals',
  description: 'Networking for engineers and product folks at HITEC City and Gachibowli.',
  type: 'WORKPLACE',
  city: 'Hyderabad',
  memberCount: 274,
  postCount: 61,
  isActive: true,
  createdBy: 'usr-007',
  createdAt: '2025-09-10T10:00:00+05:30'
}, {
  id: 'com-05',
  name: 'Punjabi Cultural Group – Delhi',
  description: 'Bhangra nights, langar community kitchen and festival meetups across Delhi NCR.',
  type: 'LANGUAGE',
  language: 'Punjabi',
  city: 'Delhi',
  memberCount: 198,
  postCount: 44,
  isActive: false,
  createdBy: 'usr-011',
  createdAt: '2025-10-01T10:00:00+05:30'
}, {
  id: 'com-06',
  name: 'Marathi Mandli – Pune',
  description: 'Pune-based Marathi speakers. Theatre nights, Ganesh Chaturthi planning and job board.',
  type: 'HOMETOWN',
  hometown: 'Maharashtra',
  city: 'Pune',
  memberCount: 321,
  postCount: 87,
  isActive: true,
  createdBy: 'usr-004',
  createdAt: '2025-08-25T10:00:00+05:30'
}, {
  id: 'com-07',
  name: 'Bengali Students & Professionals',
  description: 'For students and young professionals from West Bengal settling in metros.',
  type: 'INTEREST',
  city: 'Bengaluru',
  memberCount: 156,
  postCount: 39,
  isActive: true,
  createdBy: 'usr-012',
  createdAt: '2025-11-15T10:00:00+05:30'
}, {
  id: 'com-08',
  name: 'Gujarati Business Network',
  description: 'Entrepreneurs and traders from Gujarat — referrals, vendor lists and GST help.',
  type: 'WORKPLACE',
  city: 'Ahmedabad',
  memberCount: 143,
  postCount: 28,
  isActive: true,
  createdBy: 'usr-009',
  createdAt: '2025-12-05T10:00:00+05:30'
}];
export const MOCK_COMMUNITY_MEMBERS = [{
  id: 'mem-001',
  communityId: 'com-01',
  userId: 'usr-001',
  userName: 'Arun Krishnan',
  role: 'OWNER',
  joinedAt: '2025-07-14T10:00:00+05:30'
}, {
  id: 'mem-002',
  communityId: 'com-01',
  userId: 'usr-002',
  userName: 'Priya Raghavan',
  role: 'MODERATOR',
  joinedAt: '2025-07-20T10:00:00+05:30'
}, {
  id: 'mem-003',
  communityId: 'com-01',
  userId: 'usr-006',
  userName: 'Deepika Menon',
  role: 'MEMBER',
  joinedAt: '2025-08-11T10:00:00+05:30'
}, {
  id: 'mem-004',
  communityId: 'com-02',
  userId: 'usr-003',
  userName: 'Mohammed Faisal',
  role: 'OWNER',
  joinedAt: '2025-08-02T10:00:00+05:30'
}, {
  id: 'mem-005',
  communityId: 'com-03',
  userId: 'usr-008',
  userName: 'Fatima Sheikh',
  role: 'OWNER',
  joinedAt: '2025-06-20T10:00:00+05:30'
}, {
  id: 'mem-006',
  communityId: 'com-04',
  userId: 'usr-007',
  userName: 'Suresh Reddy',
  role: 'OWNER',
  joinedAt: '2025-09-10T10:00:00+05:30'
}, {
  id: 'mem-007',
  communityId: 'com-06',
  userId: 'usr-004',
  userName: 'Ananya Deshpande',
  role: 'OWNER',
  joinedAt: '2025-08-25T10:00:00+05:30'
}, {
  id: 'mem-008',
  communityId: 'com-07',
  userId: 'usr-012',
  userName: 'Lakshmi Narayan',
  role: 'MEMBER',
  joinedAt: '2025-11-20T10:00:00+05:30'
}];
