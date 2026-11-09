import { api } from './api';

const BASE = '/admin/analytics';

/** Platform analytics — /v1/admin/analytics/*. */
export const analyticsService = {
  async getUserGrowth() {
    // List<TimeSeriesPoint> { date, users, activeUsers, posts, connections }
    return api.get(`${BASE}/users`);
  },

  async getLanguageDistribution() {
    // List<LanguageDistribution> { language, users, percentage }
    return api.get(`${BASE}/languages`);
  },

  async getCityDistribution() {
    // List<CityDistribution> { city, users, percentage }
    return api.get(`${BASE}/locations`);
  },

  async getEngagement() {
    // EngagementMetrics { dailyActiveUsers, weeklyActiveUsers, monthlyActiveUsers,
    // avgPostsPerUser, avgConnectionsPerUser, retentionDay7, retentionDay30 }
    return api.get(`${BASE}/engagement`);
  },

  async getRetentionCohorts() {
    // No cohort-retention endpoint exists yet — return an empty result rather
    // than fabricated data.
    return [];
  }
};
