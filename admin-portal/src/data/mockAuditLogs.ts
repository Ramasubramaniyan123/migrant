import type { AuditLog } from '@/types/audit.types'

const daysAgo = (n: number, hour = 11): string => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(hour, 20, 0, 0)
  return d.toISOString()
}

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'aud-001', adminId: 'adm-003', adminName: 'Sneha Iyer', adminRole: 'MODERATOR', action: 'REPORT_RESOLVED', targetType: 'Report', targetId: 'rep-007', details: 'Dismissed — legitimate lost-and-found post', ipAddress: '103.44.12.8', result: 'SUCCESS', createdAt: daysAgo(1) },
  { id: 'aud-002', adminId: 'adm-002', adminName: 'Rahul Verma', adminRole: 'ADMIN', action: 'USER_SUSPENDED', targetType: 'User', targetId: 'usr-010', details: 'Account deactivated pending identity verification', ipAddress: '103.44.12.9', result: 'SUCCESS', createdAt: daysAgo(2) },
  { id: 'aud-003', adminId: 'adm-001', adminName: 'Priya Sharma', adminRole: 'SUPER_ADMIN', action: 'ROLE_CHANGED', targetType: 'Administrator', targetId: 'adm-005', details: 'Role assigned: ANALYST', ipAddress: '103.44.12.5', result: 'SUCCESS', createdAt: daysAgo(5) },
  { id: 'aud-004', adminId: 'adm-003', adminName: 'Sneha Iyer', adminRole: 'MODERATOR', action: 'REPORT_RESOLVED', targetType: 'Report', targetId: 'rep-005', ipAddress: '103.44.12.8', result: 'SUCCESS', createdAt: daysAgo(7) },
  { id: 'aud-005', adminId: 'adm-002', adminName: 'Rahul Verma', adminRole: 'ADMIN', action: 'COMMUNITY_CREATED', targetType: 'Community', targetId: 'com-07', ipAddress: '103.44.12.9', result: 'SUCCESS', createdAt: daysAgo(10) },
  { id: 'aud-006', adminId: 'adm-004', adminName: 'Arjun Mehta', adminRole: 'SUPPORT', action: 'NOTIFICATION_SENT', targetType: 'Notification', targetId: 'ntf-001', details: 'Maintenance announcement to ALL users', ipAddress: '103.44.12.11', result: 'SUCCESS', createdAt: daysAgo(2) },
  { id: 'aud-007', adminId: 'adm-006', adminName: 'Vikram Singh', adminRole: 'MODERATOR', action: 'USER_SUSPENDED', targetType: 'User', targetId: 'usr-011', ipAddress: '103.44.12.15', result: 'DENIED', createdAt: daysAgo(12) },
  { id: 'aud-008', adminId: 'adm-001', adminName: 'Priya Sharma', adminRole: 'SUPER_ADMIN', action: 'LANGUAGE_CREATED', targetType: 'Language', targetId: 'lang-10', ipAddress: '103.44.12.5', result: 'SUCCESS', createdAt: daysAgo(15) },
]
