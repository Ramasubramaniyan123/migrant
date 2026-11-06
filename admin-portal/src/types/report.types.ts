import type { Report, ReportCategory, ReportTargetType } from './moderation.types'

export interface ReportDetails extends Report {
  targetContent?: string
  reporterHistory: { totalReports: number; priorResolved: number }
}

export type { ReportCategory, ReportTargetType }
