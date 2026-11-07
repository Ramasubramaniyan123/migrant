import { MOCK_USER_GROWTH, MOCK_LANGUAGE_DISTRIBUTION, MOCK_CITY_DISTRIBUTION, MOCK_ACTIVITY } from '@/data/mockAnalytics';
import { MOCK_USERS } from '@/data/mockUsers';
import { MOCK_COMMUNITIES } from '@/data/mockCommunities';
import { MOCK_REPORTS } from '@/data/mockReports';
import { MOCK_POSTS } from '@/data/mockPosts';
import { mockRequest } from './api';
const CONNECTION_COUNT = 5600;
const MESSAGE_COUNT = 12400;
function buildStatistics() {
  const now = Date.now();
  const day = 86400000;
  const newToday = MOCK_USERS.filter(u => now - new Date(u.joinedAt).getTime() < day).length;
  const newWeek = MOCK_USERS.filter(u => now - new Date(u.joinedAt).getTime() < 7 * day).length;
  return {
    totalUsers: 4745,
    activeUsers: 1820,
    newRegistrationsToday: newToday + 38,
    newRegistrationsThisWeek: newWeek + 107,
    totalCommunities: MOCK_COMMUNITIES.length + 30,
    activeCommunities: MOCK_COMMUNITIES.filter(c => c.isActive).length + 26,
    totalConnections: CONNECTION_COUNT,
    pendingReports: MOCK_REPORTS.filter(r => r.status === 'PENDING' || r.status === 'UNDER_REVIEW').length,
    pendingModeration: MOCK_REPORTS.filter(r => r.status === 'PENDING').length,
    totalPosts: MOCK_POSTS.length + 1180,
    totalMessages: MESSAGE_COUNT
  };
}
export const dashboardService = {
  async getOverview() {
    return mockRequest(() => ({
      statistics: buildStatistics(),
      userGrowth: MOCK_USER_GROWTH,
      languageDistribution: MOCK_LANGUAGE_DISTRIBUTION,
      cityDistribution: MOCK_CITY_DISTRIBUTION,
      recentActivity: MOCK_ACTIVITY,
      pendingReports: MOCK_REPORTS.filter(r => r.status === 'PENDING' || r.status === 'UNDER_REVIEW')
    }));
  },
  async getStatistics() {
    return mockRequest(() => buildStatistics(), 200);
  }
};
