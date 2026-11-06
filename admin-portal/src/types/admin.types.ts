export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'SUPPORT' | 'ANALYST'

export type AdminStatus = 'ACTIVE' | 'SUSPENDED' | 'INVITED'

export interface Administrator {
  id: string
  name: string
  email: string
  role: AdminRole
  status: AdminStatus
  avatarUrl?: string
  lastLoginAt?: string
  createdAt: string
}

export interface AdminSession {
  id: string
  adminId: string
  startedAt: string
  expiresAt: string
  ipAddress: string
  userAgent: string
}
