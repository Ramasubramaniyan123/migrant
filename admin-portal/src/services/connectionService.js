import { mockRequest } from './api';

// Deterministic mock edges derived from the user list for the prototype.
const NAMES = [['usr-001', 'Arun Krishnan'], ['usr-002', 'Priya Raghavan'], ['usr-003', 'Mohammed Faisal'], ['usr-004', 'Ananya Deshpande'], ['usr-005', 'Rohit Yadav'], ['usr-006', 'Deepika Menon'], ['usr-007', 'Suresh Reddy'], ['usr-008', 'Fatima Sheikh'], ['usr-009', 'Vikram Joshi'], ['usr-011', 'Imran Khan'], ['usr-012', 'Lakshmi Narayan']];
function buildEdges() {
  const edges = [];
  let n = 0;
  const now = Date.now();
  for (let i = 0; i < NAMES.length; i++) {
    for (let j = i + 1; j < NAMES.length; j++) {
      if ((i * 7 + j * 3) % 4 === 0) continue; // sparse graph
      const status = (i + j) % 5 === 0 ? 'PENDING' : 'ACCEPTED';
      edges.push({
        id: `conn-${++n}`,
        requesterId: NAMES[i][0],
        requesterName: NAMES[i][1],
        addresseeId: NAMES[j][0],
        addresseeName: NAMES[j][1],
        status,
        createdAt: new Date(now - (i * 11 + j * 5) % 60 * 86400000).toISOString(),
        acceptedAt: status === 'ACCEPTED' ? new Date(now - (i * 9 + j * 4) % 55 * 86400000).toISOString() : undefined
      });
    }
  }
  return edges;
}
export const connectionService = {
  async list(params = {}) {
    return mockRequest(() => {
      const {
        status = 'ALL',
        search = ''
      } = params;
      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 10;
      let items = buildEdges();
      if (status !== 'ALL') items = items.filter(e => e.status === status);
      const q = search.trim().toLowerCase();
      if (q) {
        items = items.filter(e => e.requesterName.toLowerCase().includes(q) || e.addresseeName.toLowerCase().includes(q));
      }
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const total = items.length;
      const start = (page - 1) * pageSize;
      return {
        items: items.slice(start, start + pageSize),
        total,
        page,
        pageSize
      };
    }, 350);
  },
  async getStats() {
    return mockRequest(() => {
      const edges = buildEdges();
      const accepted = edges.filter(e => e.status === 'ACCEPTED').length;
      const pending = edges.filter(e => e.status === 'PENDING').length;
      const byCity = {};
      const byLang = {};
      const cities = ['Gurugram', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad'];
      const langs = ['Tamil', 'Malayalam', 'Hindi', 'Telugu', 'Marathi', 'Kannada'];
      edges.forEach((e, i) => {
        byCity[cities[i % cities.length]] = (byCity[cities[i % cities.length]] ?? 0) + 1;
        byLang[langs[i * 2 % langs.length]] = (byLang[langs[i * 2 % langs.length]] ?? 0) + 1;
      });
      return {
        total: 5600,
        pending: pending + 120,
        accepted,
        acceptanceRate: 78.4,
        avgRequestsPerUser: 2.3,
        connectionsByCity: Object.entries(byCity).map(([city, count]) => ({
          city,
          count
        })),
        connectionsByLanguage: Object.entries(byLang).map(([language, count]) => ({
          language,
          count
        })),
        weeklyTrend: Array.from({
          length: 8
        }, (_, i) => ({
          week: `W${44 - i}`,
          sent: 300 + i * 53 % 120,
          accepted: 220 + i * 41 % 90
        }))
      };
    }, 400);
  }
};
