const daysAgo = (n, hour = 14) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 15, 0, 0);
  return d.toISOString();
};
export const MOCK_REPORTS = [{
  id: 'rep-001',
  targetType: 'POST',
  targetId: 'post-003',
  targetPreview: 'BEST flats in Andheri under 15k guaranteed!!! DM me...',
  reporterId: 'usr-008',
  reporterName: 'Fatima Sheikh',
  category: 'SPAM',
  description: 'Repeated promotional post with external contact solicitation.',
  status: 'PENDING',
  priority: 'HIGH',
  createdAt: daysAgo(0, 8)
}, {
  id: 'rep-002',
  targetType: 'POST',
  targetId: 'post-010',
  targetPreview: 'FREE iPhone giveaway click the link below...',
  reporterId: 'usr-003',
  reporterName: 'Mohammed Faisal',
  category: 'SPAM',
  description: 'Obvious scam/phishing link.',
  status: 'PENDING',
  priority: 'CRITICAL',
  createdAt: daysAgo(1, 10)
}, {
  id: 'rep-003',
  targetType: 'USER',
  targetId: 'usr-005',
  targetPreview: 'Rohit Yadav (@rohit.y)',
  reporterId: 'usr-001',
  reporterName: 'Arun Krishnan',
  category: 'HARASSMENT',
  description: 'User sent abusive messages to multiple community members demanding money back for "flat deals".',
  status: 'UNDER_REVIEW',
  priority: 'HIGH',
  assignedTo: 'adm-003',
  createdAt: daysAgo(2, 16)
}, {
  id: 'rep-004',
  targetType: 'POST',
  targetId: 'post-008',
  targetPreview: 'Sharing a flat in OMR Chennai — 2BHK...',
  reporterId: 'usr-007',
  reporterName: 'Suresh Reddy',
  category: 'FAKE_PROFILE',
  description: 'Suspicious listing pattern — multiple duplicate posts across cities.',
  status: 'UNDER_REVIEW',
  priority: 'MEDIUM',
  createdAt: daysAgo(3, 11)
}, {
  id: 'rep-005',
  targetType: 'COMMENT',
  targetId: 'cmt-006',
  targetPreview: 'Scam link, do not click.',
  reporterId: 'usr-012',
  reporterName: 'Lakshmi Narayan',
  category: 'OTHER',
  description: 'Reporter says comment author is doxxing.',
  status: 'RESOLVED',
  priority: 'LOW',
  assignedTo: 'adm-003',
  createdAt: daysAgo(8, 9),
  resolvedAt: daysAgo(7, 15),
  resolution: 'Comment reviewed and kept — no policy violation found.'
}, {
  id: 'rep-006',
  targetType: 'USER',
  targetId: 'usr-010',
  targetPreview: 'Meera Pillai (@meera.p)',
  reporterId: 'usr-002',
  reporterName: 'Priya Raghavan',
  category: 'FAKE_PROFILE',
  description: 'Profile photo appears stolen; name mismatch with documents suggested.',
  status: 'RESOLVED',
  priority: 'MEDIUM',
  assignedTo: 'adm-002',
  createdAt: daysAgo(20, 13),
  resolvedAt: daysAgo(18, 10),
  resolution: 'Account deactivated pending identity verification.'
}, {
  id: 'rep-007',
  targetType: 'POST',
  targetId: 'post-005',
  targetPreview: 'Lost my wallet near India Gate metro...',
  reporterId: 'usr-004',
  reporterName: 'Ananya Deshpande',
  category: 'INAPPROPRIATE_CONTENT',
  description: 'Claims post reveals exact travel pattern for stalking.',
  status: 'DISMISSED',
  priority: 'LOW',
  createdAt: daysAgo(15, 17),
  resolvedAt: daysAgo(14, 12),
  resolution: 'Dismissed — post is a legitimate lost-and-found notice.'
}, {
  id: 'rep-008',
  targetType: 'MESSAGE',
  targetId: 'msg-thread-9',
  targetPreview: 'Conversation between usr-005 and usr-009',
  reporterId: 'usr-009',
  reporterName: 'Vikram Joshi',
  category: 'PRIVACY_VIOLATION',
  description: 'User shared private phone number publicly in chat.',
  status: 'PENDING',
  priority: 'MEDIUM',
  createdAt: daysAgo(0, 12)
}];
export const MOCK_MODERATION_ACTIONS = [{
  id: 'mod-001',
  reportId: 'rep-006',
  adminId: 'adm-002',
  adminName: 'Rahul Verma',
  action: 'SUSPEND_USER',
  targetType: 'USER',
  targetId: 'usr-010',
  reason: 'Suspected fake profile — awaiting document verification',
  createdAt: daysAgo(18, 10)
}, {
  id: 'mod-002',
  reportId: 'rep-007',
  adminId: 'adm-003',
  adminName: 'Sneha Iyer',
  action: 'DISMISS',
  targetType: 'POST',
  targetId: 'post-005',
  reason: 'Legitimate lost-and-found post',
  createdAt: daysAgo(14, 12)
}, {
  id: 'mod-003',
  adminId: 'adm-003',
  adminName: 'Sneha Iyer',
  action: 'REMOVE_CONTENT',
  targetType: 'POST',
  targetId: 'post-002',
  reason: 'Duplicate event spam (restored after review)',
  createdAt: daysAgo(10, 9)
}, {
  id: 'mod-004',
  reportId: 'rep-005',
  adminId: 'adm-003',
  adminName: 'Sneha Iyer',
  action: 'DISMISS',
  targetType: 'COMMENT',
  targetId: 'cmt-006',
  reason: 'No policy violation',
  createdAt: daysAgo(7, 15)
}, {
  id: 'mod-005',
  adminId: 'adm-002',
  adminName: 'Rahul Verma',
  action: 'WARN_USER',
  targetType: 'USER',
  targetId: 'usr-005',
  reason: 'First spam warning issued',
  createdAt: daysAgo(6, 14)
}];
