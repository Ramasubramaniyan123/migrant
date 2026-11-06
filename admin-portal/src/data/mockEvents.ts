import type { CommunityEvent, EventParticipant } from '@/types/event.types'

const daysFromNow = (n: number, hour = 18): string => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

export const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: 'evt-001', title: 'Deepavali Community Lunch', description: 'Potluck lunch celebrating Deepavali with Tamil delicacies. Bring a dish to share.',
    communityId: 'com-01', communityName: 'Tamil Nadu Migrants – Gurugram', location: 'DLF Phase 2 Community Hall',
    city: 'Gurugram', startsAt: daysFromNow(4, 13), endsAt: daysFromNow(4, 16), capacity: 60, participantCount: 41,
    status: 'UPCOMING', organizerId: 'usr-002', organizerName: 'Priya Raghavan', createdAt: daysFromNow(-2),
  },
  {
    id: 'evt-002', title: 'Onam Sadya Cooking Batch', description: 'Learn to make Kerala sadya dishes. Ingredients provided; take home what you cook.',
    communityId: 'com-02', communityName: 'Malayalam Circle – Bengaluru', location: 'Indiranagar, Bengaluru',
    city: 'Bengaluru', startsAt: daysFromNow(2, 10), endsAt: daysFromNow(2, 15), capacity: 20, participantCount: 18,
    status: 'UPCOMING', organizerId: 'usr-003', organizerName: 'Mohammed Faisal', createdAt: daysFromNow(-5),
  },
  {
    id: 'evt-003', title: 'Weekend Cricket Tournament', description: '5-a-side cricket at the Sector 62 grounds. All skill levels welcome.',
    communityId: 'com-01', communityName: 'Tamil Nadu Migrants – Gurugram', location: 'Gurugram Sports Complex',
    city: 'Gurugram', startsAt: daysFromNow(9, 7), endsAt: daysFromNow(9, 13), capacity: 40, participantCount: 27,
    status: 'UPCOMING', organizerId: 'usr-001', organizerName: 'Arun Krishnan', createdAt: daysFromNow(-1),
  },
  {
    id: 'evt-004', title: 'GST Filing Help Camp', description: 'Free GST filing assistance for small business owners and freelancers.',
    communityId: 'com-08', communityName: 'Gujarati Business Network', location: 'Satellite, Ahmedabad',
    city: 'Ahmedabad', startsAt: daysFromNow(1, 10), endsAt: daysFromNow(1, 17), capacity: 30, participantCount: 30,
    status: 'ONGOING', organizerId: 'usr-009', organizerName: 'Vikram Joshi', createdAt: daysFromNow(-4),
  },
  {
    id: 'evt-005', title: 'Monsoon Trek – Malshej Ghat', description: 'One-day trek for community members. Transport provided from Pune.',
    communityId: 'com-06', communityName: 'Marathi Mandli – Pune', location: 'Malshej Ghat, Maharashtra',
    city: 'Pune', startsAt: daysFromNow(-10, 6), endsAt: daysFromNow(-10, 18), capacity: 25, participantCount: 22,
    status: 'COMPLETED', organizerId: 'usr-004', organizerName: 'Ananya Deshpande', createdAt: daysFromNow(-20),
  },
  {
    id: 'evt-006', title: 'Diwali Mela 2025', description: 'Annual community fair with food stalls, games and cultural performances.',
    communityId: 'com-03', communityName: 'Mumbai Foodies & Housing', location: 'Sion Grounds, Mumbai',
    city: 'Mumbai', startsAt: daysFromNow(-30, 17), endsAt: daysFromNow(-30, 22), capacity: 500, participantCount: 412,
    status: 'COMPLETED', organizerId: 'usr-008', organizerName: 'Fatima Sheikh', createdAt: daysFromNow(-45),
  },
]

export const MOCK_EVENT_PARTICIPANTS: EventParticipant[] = [
  { id: 'ep-001', eventId: 'evt-001', userId: 'usr-001', userName: 'Arun Krishnan', status: 'REGISTERED', registeredAt: daysFromNow(-1) },
  { id: 'ep-002', eventId: 'evt-001', userId: 'usr-006', userName: 'Deepika Menon', status: 'REGISTERED', registeredAt: daysFromNow(-2) },
  { id: 'ep-003', eventId: 'evt-001', userId: 'usr-002', userName: 'Priya Raghavan', status: 'REGISTERED', registeredAt: daysFromNow(-3) },
  { id: 'ep-004', eventId: 'evt-002', userId: 'usr-006', userName: 'Deepika Menon', status: 'REGISTERED', registeredAt: daysFromNow(-4) },
  { id: 'ep-005', eventId: 'evt-002', userId: 'usr-012', userName: 'Lakshmi Narayan', status: 'REGISTERED', registeredAt: daysFromNow(-5) },
  { id: 'ep-006', eventId: 'evt-003', userId: 'usr-001', userName: 'Arun Krishnan', status: 'REGISTERED', registeredAt: daysFromNow(-1) },
  { id: 'ep-007', eventId: 'evt-005', userId: 'usr-004', userName: 'Ananya Deshpande', status: 'ATTENDED', registeredAt: daysFromNow(-12) },
  { id: 'ep-008', eventId: 'evt-005', userId: 'usr-012', userName: 'Lakshmi Narayan', status: 'ATTENDED', registeredAt: daysFromNow(-12) },
]
