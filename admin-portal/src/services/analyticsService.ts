import type {
  TimeSeriesPoint,
  LanguageDistribution,
  CityDistribution,
  EngagementMetrics,
} from '@/types/analytics.types'
import {
  MOCK_USER_GROWTH,
  MOCK_LANGUAGE_DISTRIBUTION,
  MOCK_CITY_DISTRIBUTION,
  MOCK_ENGAGEMENT,
} from '@/data/mockAnalytics'
import { mockRequest } from './api'

export interface AnalyticsRange {
  from?: string
  to?: string
}

export const analyticsService = {
  async getUserGrowth(range: AnalyticsRange = {}): Promise<TimeSeriesPoint[]> {
    return mockRequest(() => MOCK_USER_GROWTH, 400)
  },

  async getLanguageDistribution(): Promise<LanguageDistribution[]> {
    return mockRequest(() => MOCK_LANGUAGE_DISTRIBUTION, 350)
  },

  async getCityDistribution(): Promise<CityDistribution[]> {
    return mockRequest(() => MOCK_CITY_DISTRIBUTION, 350)
  },

  async getEngagement(): Promise<EngagementMetrics> {
    return mockRequest(() => MOCK_ENGAGEMENT, 350)
  },

  async getRetentionCohorts() {
    return mockRequest(
      () => [
        { cohort: 'Week of Oct 27', size: 320, day1: 78, day7: 61, day30: 42 },
        { cohort: 'Week of Nov 3', size: 287, day1: 81, day7: 64, day30: null },
        { cohort: 'This week', size: 145, day1: 84, day7: null, day30: null },
      ],
      400,
    )
  },
}
