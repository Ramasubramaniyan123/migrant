import { api } from './api';

const BASE = '/admin/connections';

const PAGE_SIZE = 100;
const MAX_PAGES = 50; // safety bound (~5000 connections)

function toEdge(c) {
  return {
    id: String(c.id),
    requesterId: c.requesterId != null ? String(c.requesterId) : null,
    requesterName: c.requesterName,
    addresseeId: c.receiverId != null ? String(c.receiverId) : null,
    addresseeName: c.receiverName,
    status: c.status,
    matchScore: c.matchScore,
    createdAt: c.createdAt,
    acceptedAt: c.status === 'ACCEPTED' ? c.updatedAt : undefined
  };
}

async function fetchAllConnections() {
  // The endpoint is Spring-Data paged (page/size/sort only — no status or
  // search params), so pages are walked and filtering happens client-side.
  const all = [];
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const res = await api.get(BASE, {
      params: { page, size: PAGE_SIZE, sort: 'id,desc' }
    });
    const content = res?.content ?? [];
    all.push(...content.map(toEdge));
    if (res?.last ?? page + 1 >= (res?.totalPages ?? 1)) break;
  }
  return all;
}

/** Connection administration — /v1/admin/connections/*. */
export const connectionService = {
  async list(params = {}) {
    const { status = 'ALL', search = '' } = params;
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;

    let items = await fetchAllConnections();
    if (status !== 'ALL') items = items.filter(e => e.status === status);
    const q = search.trim().toLowerCase();
    if (q) {
      items = items.filter(e =>
        (e.requesterName ?? '').toLowerCase().includes(q) ||
        (e.addresseeName ?? '').toLowerCase().includes(q)
      );
    }
    items.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));

    const total = items.length;
    const start = (page - 1) * pageSize;
    return {
      items: items.slice(start, start + pageSize),
      total,
      page,
      pageSize
    };
  },

  async getStats() {
    // { totalConnections, pendingRequests, accepted, rejected }
    const s = await api.get(`${BASE}/analytics`);
    const total = s.totalConnections ?? 0;
    const accepted = s.accepted ?? 0;
    return {
      total,
      pending: s.pendingRequests ?? 0,
      accepted,
      acceptanceRate: total > 0 ? Math.round((accepted / total) * 1000) / 10 : 0,
      avgRequestsPerUser: undefined,
      connectionsByCity: [],
      connectionsByLanguage: [],
      weeklyTrend: []
    };
  }
};
