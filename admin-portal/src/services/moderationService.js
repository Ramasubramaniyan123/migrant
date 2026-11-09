import { api, ApiError } from './api';

const BASE = '/admin/moderation';

const STATUS_ORDER = { PENDING: 0, UNDER_REVIEW: 1, RESOLVED: 2, DISMISSED: 3 };

function paginate(items, params = {}) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const total = items.length;
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize
  };
}

async function fetchAllReports() {
  // status/category are the only server-side filters; targetType and priority
  // are applied client-side below.
  return api.get(`${BASE}/reports`, { params: { status: 'ALL', category: 'ALL' } });
}

/** Report moderation — /v1/admin/moderation/*. */
export const moderationService = {
  async listReports(params = {}) {
    const { status = 'ALL', category = 'ALL', targetType = 'ALL', priority = 'ALL' } = params;
    let items = await api.get(`${BASE}/reports`, {
      params: { status, category }
    });
    if (targetType !== 'ALL') items = items.filter(r => r.targetType === targetType);
    if (priority !== 'ALL') items = items.filter(r => r.priority === priority);
    items = [...items].sort((a, b) =>
      (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9) ||
      (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
    );
    return paginate(items, params);
  },

  async getReport(id) {
    // Returns ReportDetails incl. targetContent and reporterHistory.
    return api.get(`${BASE}/reports/${id}`);
  },

  async assignReport() {
    // No assign endpoint exists; resolution endpoints record the acting admin.
    throw new ApiError('Assigning reports is not supported by the backend yet', 501);
  },

  async resolveReport(id, resolution) {
    return api.patch(`${BASE}/reports/${id}/resolve`, { resolution });
  },

  async dismissReport(id, reason) {
    return api.patch(`${BASE}/reports/${id}/dismiss`, { reason });
  },

  async suspendUserForReport(reportId) {
    // No dedicated endpoint — suspend the reported user directly when the
    // report targets a USER account.
    const report = await this.getReport(reportId);
    if (report.targetType !== 'USER' || !report.targetId) {
      throw new ApiError('This report is not against a user account', 400);
    }
    return api.patch(`/admin/users/${report.targetId}/suspend`);
  },

  async listModerationActions() {
    return api.get(`${BASE}/history`);
  },

  async getModerationStats() {
    const all = await fetchAllReports();
    return {
      pending: all.filter(r => r.status === 'PENDING').length,
      underReview: all.filter(r => r.status === 'UNDER_REVIEW').length,
      resolvedThisWeek: all.filter(r => r.status === 'RESOLVED').length,
      dismissedThisWeek: all.filter(r => r.status === 'DISMISSED').length,
      byCategory: all.reduce((acc, r) => {
        acc[r.category] = (acc[r.category] ?? 0) + 1;
        return acc;
      }, {})
    };
  }
};
