export type ReportStatus = 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED'
export type ReportCategory =
  | 'SPAM'
  | 'HARASSMENT'
  | 'HATE_SPEECH'
  | 'INAPPROPRIATE_CONTENT'
  | 'FAKE_PROFILE'
  | 'PRIVACY_VIOLATION'
  | 'OTHER'

export type ReportTargetType = 'POST' | 'USER' | 'COMMENT' | 'MESSAGE' | 'COMMUNITY'

export interface Report {
  id: string
  targetType: ReportTargetType
  targetId: string
  targetPreview: string
  reporterId: string
  reporterName: string
  category: ReportCategory
  description: string
  status: ReportStatus
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  assignedTo?: string
  createdAt: string
  resolvedAt?: string
  resolution?: string
}

export interface ModerationAction {
  id: string
  reportId?: string
  adminId: string
  adminName: string
  action: 'DISMISS' | 'REMOVE_CONTENT' | 'SUSPEND_USER' | 'WARN_USER' | 'RESTORE_CONTENT' | 'ESCALATE'
  targetType: ReportTargetType | 'USER'
  targetId: string
  reason: string
  createdAt: string
}
