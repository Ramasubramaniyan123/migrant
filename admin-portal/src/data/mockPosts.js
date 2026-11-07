const daysAgo = (n, hour = 12) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 30, 0, 0);
  return d.toISOString();
};
export const MOCK_POSTS = [{
  id: 'post-001',
  authorId: 'usr-001',
  authorName: 'Arun Krishnan',
  communityId: 'com-01',
  communityName: 'Tamil Nadu Migrants – Gurugram',
  content: 'Anyone know a good Tamil grocery store near Cyber City? Looking for milagai podi and coconut oil brands we get back home.',
  likeCount: 24,
  commentCount: 11,
  isFlagged: false,
  createdAt: daysAgo(0, 9)
}, {
  id: 'post-002',
  authorId: 'usr-002',
  authorName: 'Priya Raghavan',
  communityId: 'com-01',
  communityName: 'Tamil Nadu Migrants – Gurugram',
  content: 'Organising a small Deepavali lunch this Sunday at DLF Phase 2 community hall. 40 seats, RS 250 per plate. DM to reserve.',
  likeCount: 58,
  commentCount: 32,
  isFlagged: false,
  createdAt: daysAgo(1, 18)
}, {
  id: 'post-003',
  authorId: 'usr-005',
  authorName: 'Rohit Yadav',
  communityId: 'com-03',
  communityName: 'Mumbai Foodies & Housing',
  content: 'BEST flats in Andheri under 15k guaranteed!!! DM me for exclusive deals no brokers needed trust me bro',
  imageUrl: 'https://picsum.photos/seed/flatad/800/400',
  likeCount: 3,
  commentCount: 9,
  isFlagged: true,
  createdAt: daysAgo(0, 7)
}, {
  id: 'post-004',
  authorId: 'usr-003',
  authorName: 'Mohammed Faisal',
  communityId: 'com-02',
  communityName: 'Malayalam Circle – Bengaluru',
  content: 'Onam sadya cooking batch this Saturday at my place in Indiranagar. Bring your own tiffin, we provide the recipes!',
  likeCount: 41,
  commentCount: 18,
  isFlagged: false,
  createdAt: daysAgo(2, 11)
}, {
  id: 'post-005',
  authorId: 'usr-011',
  authorName: 'Imran Khan',
  communityId: 'com-05',
  communityName: 'Punjabi Cultural Group – Delhi',
  content: 'Lost my wallet near India Gate metro station yesterday evening. Contains ID cards and Rs 3000. Please contact if found.',
  likeCount: 17,
  commentCount: 6,
  isFlagged: false,
  createdAt: daysAgo(1, 15)
}, {
  id: 'post-006',
  authorId: 'usr-012',
  authorName: 'Lakshmi Narayan',
  communityId: 'com-07',
  communityName: 'Bengali Students & Professionals',
  content: 'Looking for Kannada spoken practice partners on weekends — I am improving for my upcoming move to Mysuru office.',
  likeCount: 9,
  commentCount: 4,
  isFlagged: false,
  createdAt: daysAgo(3, 19)
}, {
  id: 'post-007',
  authorId: 'usr-009',
  authorName: 'Vikram Joshi',
  communityId: 'com-08',
  communityName: 'Gujarati Business Network',
  content: 'GST filing camp at our Satellite office this Friday. Free for community members, carry PAN and last 3 months bank statements.',
  likeCount: 33,
  commentCount: 14,
  isFlagged: false,
  createdAt: daysAgo(2, 10)
}, {
  id: 'post-008',
  authorId: 'usr-006',
  authorName: 'Deepika Menon',
  communityId: 'com-01',
  communityName: 'Tamil Nadu Migrants – Gurugram',
  content: 'Sharing a flat in OMR Chennai — 2BHK near IT corridor, Rs 22k/month, family preferred. Serious inquiries only.',
  likeCount: 27,
  commentCount: 21,
  isFlagged: false,
  createdAt: daysAgo(4, 16)
}, {
  id: 'post-009',
  authorId: 'usr-004',
  authorName: 'Ananya Deshpande',
  communityId: 'com-06',
  communityName: 'Marathi Mandli – Pune',
  content: 'Pune Marathi theatre group needs extras for our Diwali special — no experience needed, rehearsal starts Monday.',
  likeCount: 15,
  commentCount: 7,
  isFlagged: false,
  createdAt: daysAgo(5, 13)
}, {
  id: 'post-010',
  authorId: 'usr-010',
  authorName: 'Meera Pillai',
  communityId: 'com-02',
  communityName: 'Malayalam Circle – Bengaluru',
  content: 'FREE iPhone giveaway click the link below claim now limited spots',
  likeCount: 1,
  commentCount: 2,
  isFlagged: true,
  createdAt: daysAgo(6, 8)
}];
export const MOCK_POST_COMMENTS = [{
  id: 'cmt-001',
  postId: 'post-001',
  authorId: 'usr-002',
  authorName: 'Priya Raghavan',
  content: 'Try the store inside Forum Mall, they stock authentic brands.',
  createdAt: daysAgo(0, 10)
}, {
  id: 'cmt-002',
  postId: 'post-001',
  authorId: 'usr-006',
  authorName: 'Deepika Menon',
  content: 'Annapoorna stores in DLF also have good milagai podi.',
  createdAt: daysAgo(0, 11)
}, {
  id: 'cmt-003',
  postId: 'post-002',
  authorId: 'usr-001',
  authorName: 'Arun Krishnan',
  content: 'Count me in! What time does lunch start?',
  createdAt: daysAgo(1, 19)
}, {
  id: 'cmt-004',
  postId: 'post-002',
  authorId: 'usr-006',
  authorName: 'Deepika Menon',
  content: 'I can bring payasam. Will confirm headcount by Friday.',
  createdAt: daysAgo(1, 20)
}, {
  id: 'cmt-005',
  postId: 'post-003',
  authorId: 'usr-008',
  authorName: 'Fatima Sheikh',
  content: 'This looks like spam, reporting it.',
  createdAt: daysAgo(0, 8)
}, {
  id: 'cmt-006',
  postId: 'post-010',
  authorId: 'usr-003',
  authorName: 'Mohammed Faisal',
  content: 'Scam link, do not click.',
  createdAt: daysAgo(6, 9)
}];
