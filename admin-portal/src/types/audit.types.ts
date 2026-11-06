export interface AuditLog {
  id: string
  adminId: string
  adminName: string
  adminRole: string
  action: string
  targetType: string
  targetId: string
  details?: string
  ipAddress: string
  result: 'SUCCESS' | 'FAILURE' | 'DENIED'
  createdAt: string
}
