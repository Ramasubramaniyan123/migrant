import { MOCK_REPORTS, MOCK_MODERATION_ACTIONS } from '@/data/mockReports';
import { clone } from '@/utils/helpers';
import { mockRequest, MockStore } from './api';
const store = new MockStore('admin_portal_reports', () => clone(MOCK_REPORTS));
const actionStore = new MockStore('admin_portal_moderation_actions', () => clone(MOCK_MODERATION_ACTIONS));
export const moderationService = {
  async listReports(params = {}) {
    return mockRequest(() => {
      const {
        status = 'ALL',
        category = 'ALL',
        targetType = 'ALL',
        priority = 'ALL'
      } = params;
      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 10;
      let items = store.all();
      if (status !== 'ALL') items = items.filter(r => r.status === status);
      if (category !== 'ALL') items = items.filter(r => r.category === category);
      if (targetType !== 'ALL') items = items.filter(r => r.targetType === targetType);
      if (priority !== 'ALL') items = items.filter(r => r.priority === priority);

      // PENDING/UNDER_REVIEW first, then newest
      const order = {
        PENDING: 0,
        UNDER_REVIEW: 1,
        RESOLVED: 2,
        DISMISSED: 3
      };
      items.sort((a, b) => order[a.status] - order[b.status] || b.createdAt.localeCompare(a.createdAt));
      const total = items.length;
      const start = (page - 1) * pageSize;
      return {
        items: items.slice(start, start + pageSize),
        total,
        page,
        pageSize
      };
    }, 400);
  },
  async getReport(id) {
    return mockRequest(() => {
      const report = store.find(id);
      if (!report) return undefined;
      return {
        ...clone(report),
        targetContent: report.targetPreview,
        reporterHistory: {
          totalReports: 1,
          priorResolved: report.status === 'RESOLVED' ? 1 : 0
        }
      };
    }, 300);
  },
  async assignReport(id, adminId, adminName) {
    return mockRequest(() => store.update(id, {
      status: 'UNDER_REVIEW',
      assignedTo: `${adminName} (${adminId})`
    }), 300);
  },
  async resolveReport(id, resolution, adminId, adminName) {
    return mockRequest(() => {
      const updated = store.update(id, {
        status: 'RESOLVED',
        resolvedAt: new Date().toISOString(),
        resolution
      });
      if (updated) {
        actionStore.create({
          reportId: id,
          adminId,
          adminName,
          action: 'REMOVE_CONTENT',
          targetType: updated.targetType,
          targetId: updated.targetId,
          reason: resolution,
          createdAt: new Date().toISOString()
        });
      }
      return updated;
    }, 400);
  },
  async dismissReport(id, reason, adminId, adminName) {
    return mockRequest(() => {
      const updated = store.update(id, {
        status: 'DISMISSED',
        resolvedAt: new Date().toISOString(),
        resolution: reason
      });
      if (updated) {
        actionStore.create({
          reportId: id,
          adminId,
          adminName,
          action: 'DISMISS',
          targetType: updated.targetType,
          targetId: updated.targetId,
          reason,
          createdAt: new Date().toISOString()
        });
      }
      return updated;
    }, 400);
  },
  async suspendUserForReport(reportId, reason, adminId, adminName) {
    await mockRequest(() => {
      const report = store.find(reportId);
      if (!report || report.targetType !== 'USER') {
        throw new Error('This report is not against a user account');
      }
      actionStore.create({
        reportId,
        adminId,
        adminName,
        action: 'SUSPEND_USER',
        targetType: 'USER',
        targetId: report.targetId,
        reason,
        createdAt: new Date().toISOString()
      });
    }, 400);
  },
  async listModerationActions() {
    return mockRequest(() => clone(actionStore.all()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), 300);
  },
  async getModerationStats() {
    return mockRequest(() => {
      const all = store.all();
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
    }, 250);
  }
};
