import { api, ApiError } from './api';

const BASE = '/admin/posts';

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

async function fetchAllPosts({ flaggedOnly = false, communityId } = {}) {
  if (flaggedOnly) {
    return api.get(`${BASE}/flagged`);
  }
  return api.get(BASE, {
    params: communityId ? { communityId } : undefined
  });
}

/** Post administration — /v1/admin/posts/*. */
export const postService = {
  async list(params = {}) {
    const { search = '', flaggedOnly = false, communityId } = params;
    // The backend returns unpaginated lists; search/filter/pagination is
    // applied client-side to preserve the existing UI contract.
    let items = await fetchAllPosts({ flaggedOnly, communityId });
    const q = search.trim().toLowerCase();
    if (q) {
      items = items.filter(p =>
        (p.content ?? '').toLowerCase().includes(q) ||
        (p.authorName ?? '').toLowerCase().includes(q)
      );
    }
    items = [...items].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
    return paginate(items, params);
  },

  async getById(id) {
    return api.get(`${BASE}/${id}`);
  },

  async getComments() {
    // No admin endpoint exposes post comments yet.
    return [];
  },

  async setFlagged() {
    // No endpoint exists to flag/unflag posts (flags are created by users).
    throw new ApiError('Flagging posts is not supported by the backend yet', 501);
  },

  async remove(id) {
    await api.delete(`${BASE}/${id}`);
  },

  async getStats() {
    const all = await fetchAllPosts({});
    return {
      total: all.length,
      flagged: all.filter(p => p.isFlagged).length,
      totalLikes: all.reduce((s, p) => s + (p.likeCount ?? 0), 0),
      totalComments: all.reduce((s, p) => s + (p.commentCount ?? 0), 0)
    };
  }
};
