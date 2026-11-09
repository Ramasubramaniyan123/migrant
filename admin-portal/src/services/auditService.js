import { api, ApiError } from './api';

const BASE = '/admin/audit-logs';

function paginate(items, params = {}) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 15;
  const total = items.length;
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize
  };
}

/** Audit logs — /v1/admin/audit-logs (read-only; ADMIN+ANALYST+). */
export const auditService = {
  async list(params = {}) {
    const {
      adminId = 'ALL',
      action = 'ALL',
      targetType = 'ALL',
      result = 'ALL',
      from,
      to
    } = params;
    // Backend returns the most recent 500 logs unpaginated; filters and
    // pagination are applied client-side.
    let items = await api.get(BASE);
    if (adminId !== 'ALL') items = items.filter(l => l.adminId === adminId);
    if (action !== 'ALL') items = items.filter(l => l.action === action);
    if (targetType !== 'ALL') items = items.filter(l => l.targetType === targetType);
    if (result !== 'ALL') items = items.filter(l => l.result === result);
    if (from) items = items.filter(l => (l.createdAt ?? '') >= from);
    if (to) items = items.filter(l => (l.createdAt ?? '') <= `${to}T23:59:59`);
    items = [...items].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
    return paginate(items, params);
  },

  async record() {
    // Audit entries are written server-side by the backend; clients cannot
    // append to the immutable log.
    throw new ApiError('Audit entries are recorded by the backend and cannot be created manually', 501);
  },

  async getFilterOptions() {
    const all = await api.get(BASE);
    return {
      admins: Array.from(new Map(all.map(l => [l.adminId, l.adminName])).entries())
        .filter(([id]) => id != null)
        .map(([id, name]) => ({ id, name })),
      actions: Array.from(new Set(all.map(l => l.action))).sort(),
      targetTypes: Array.from(new Set(all.map(l => l.targetType))).sort()
    };
  }
};
