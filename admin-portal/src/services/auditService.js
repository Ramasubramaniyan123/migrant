import { MOCK_AUDIT_LOGS } from '@/data/mockAuditLogs';
import { clone } from '@/utils/helpers';
import { mockRequest, MockStore } from './api';
const store = new MockStore('admin_portal_audit_logs', () => clone(MOCK_AUDIT_LOGS));
export const auditService = {
  async list(params = {}) {
    return mockRequest(() => {
      const {
        adminId = 'ALL',
        action = 'ALL',
        targetType = 'ALL',
        result = 'ALL'
      } = params;
      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 15;
      let items = store.all();
      if (adminId !== 'ALL') items = items.filter(l => l.adminId === adminId);
      if (action !== 'ALL') items = items.filter(l => l.action === action);
      if (targetType !== 'ALL') items = items.filter(l => l.targetType === targetType);
      if (result !== 'ALL') items = items.filter(l => l.result === result);
      if (params.from) items = items.filter(l => l.createdAt >= params.from);
      if (params.to) items = items.filter(l => l.createdAt <= `${params.to}T23:59:59`);
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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
  /** Audit logs are immutable — only append is allowed. */
  async record(entry) {
    return mockRequest(() => store.create({
      ...entry,
      createdAt: new Date().toISOString()
    }), 200);
  },
  async getFilterOptions() {
    return mockRequest(() => {
      const all = store.all();
      return {
        admins: Array.from(new Map(all.map(l => [l.adminId, l.adminName])).entries()).map(([id, name]) => ({
          id,
          name
        })),
        actions: Array.from(new Set(all.map(l => l.action))).sort(),
        targetTypes: Array.from(new Set(all.map(l => l.targetType))).sort()
      };
    }, 200);
  }
};
