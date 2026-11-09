import { api } from './api';

const BASE = '/admin/dashboard';

/** Dashboard — /v1/admin/dashboard/*. */
export const dashboardService = {
  async getOverview() {
    // DashboardOverview { statistics, userGrowth, languageDistribution,
    // cityDistribution, recentActivity, pendingReports } — same shape the UI uses.
    return api.get(`${BASE}/overview`);
  },

  async getStatistics() {
    return api.get(`${BASE}/statistics`);
  }
};
