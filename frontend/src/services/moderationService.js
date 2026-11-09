import apiClient from './api/apiClient';

const moderationService = {
  // Submit report
  submitReport: async (targetType, targetId, category, reason, description) => {
    const response = await apiClient.post('/moderation/reports', {
      targetType,
      targetId,
      category,
      reason,
      description,
    });
    return response.data;
  },

  // Get my reports
  getMyReports: async (page = 0, size = 20) => {
    const params = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/moderation/reports/mine?${params.toString()}`);
    return response.data;
  },

  // Get report status
  getReportStatus: async (id) => {
    const response = await apiClient.get(`/moderation/reports/${id}`);
    return response.data;
  },
};

export default moderationService;
