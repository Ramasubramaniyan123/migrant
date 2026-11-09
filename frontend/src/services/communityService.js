import { request } from './api';

/* ------------------------------------------------------------------ *
 * Community + post mapping                                             *
 * ------------------------------------------------------------------ */

/** CommunityDetailsResponse → the community shape the UI expects. */
function detailsToCommunity(d) {
  return {
    id: Number(d.id),
    name: d.name,
    description: d.description ?? '',
    languageId: d.languageId ?? undefined,
    languageName: d.languageName ?? undefined,
    isPublic: d.publicCommunity ?? true,
    memberCount: d.memberCount ?? 0,
    member: Boolean(d.member),
    memberRole: d.memberRole ?? undefined,
    locationCity: d.locationCity ?? undefined,
    locationCountry: d.locationCountry ?? undefined,
    createdBy: undefined,
    createdAt: d.createdAt
  };
}

/** CommunityResponse (list item) → community shape; details are enriched lazily. */
function listItemToCommunity(c) {
  return {
    id: Number(c.id),
    name: c.name,
    description: '',
    languageId: undefined,
    languageName: undefined,
    languageCode: c.languageCode ?? undefined,
    isPublic: true,
    memberCount: c.memberCount ?? 0,
    member: false,
    memberRole: undefined,
    locationCity: undefined,
    locationCountry: undefined,
    createdBy: undefined,
    createdAt: undefined
  };
}

/** PostDetailsResponse → the post shape used by the community feed. */
function postToFrontend(p) {
  return {
    id: Number(p.id),
    communityId: p.communityId !== null && p.communityId !== undefined ? Number(p.communityId) : undefined,
    communityName: p.communityName ?? undefined,
    userId: p.authorId !== null && p.authorId !== undefined ? Number(p.authorId) : undefined,
    authorId: p.authorId ?? undefined,
    authorName: p.authorName ?? undefined,
    authorAvatarUrl: p.authorAvatarUrl ?? undefined,
    content: p.content ?? '',
    imageUrl: p.imageUrl ?? p.imageUrls?.[0] ?? null,
    imageUrls: p.imageUrls ?? [],
    likeCount: p.likeCount ?? 0,
    commentCount: p.commentCount ?? 0,
    likedByMe: Boolean(p.likedByMe),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt
  };
}

async function fetchPage(path) {
  const page = await request(path);
  return page?.content ?? [];
}

const numericOrNull = value => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

export const communityService = {
  /** `GET /v1/communities?query=` — list items are enriched with details. */
  async getCommunities(search = '') {
    const params = new URLSearchParams({ size: '100', page: '0' });
    if (search?.trim()) params.set('query', search.trim());
    const items = await fetchPage(`/v1/communities?${params.toString()}`);
    // The list endpoint returns a thin DTO; fetch details per community so the
    // cards can show description, location and language.
    const enriched = await Promise.all(
      items.map(async item => {
        try {
          return detailsToCommunity(await request(`/v1/communities/${item.id}`));
        } catch {
          return listItemToCommunity(item);
        }
      })
    );
    return enriched;
  },

  /** `GET /v1/communities/{id}` → CommunityDetailsResponse. */
  async getCommunityById(id) {
    return detailsToCommunity(await request(`/v1/communities/${id}`));
  },

  /** `GET /v1/communities/mine` → memberships shaped for the UI. */
  async getMembershipsForUser(userId) {
    const rows = await fetchPage('/v1/communities/mine?size=100');
    return rows.map(d => ({
      id: Number(d.id),
      communityId: Number(d.id),
      userId: Number(userId),
      role: d.memberRole ?? 'MEMBER',
      joinedAt: d.createdAt
    }));
  },

  /** `GET /v1/communities/{id}/members` → member rows. */
  async getMembersForCommunity(communityId) {
    const rows = await fetchPage(`/v1/communities/${communityId}/members?size=100`);
    return rows.map(m => ({
      id: Number(m.userId),
      communityId: Number(communityId),
      userId: Number(m.userId),
      displayName: m.displayName,
      role: m.role,
      joinedAt: m.joinedAt
    }));
  },

  /** Membership is derived from the community details (`member` flag). */
  async isMember(userId, communityId) {
    const details = await request(`/v1/communities/${communityId}`);
    return Boolean(details?.member);
  },

  async joinCommunity(userId, communityId) {
    await request(`/v1/communities/${communityId}/join`, { method: 'POST' });
    return { id: Number(communityId), communityId: Number(communityId), userId: Number(userId), role: 'MEMBER', joinedAt: new Date().toISOString() };
  },

  async leaveCommunity(userId, communityId) {
    await request(`/v1/communities/${communityId}/leave`, { method: 'POST' });
  },

  /** `POST /v1/communities` → CommunityDetailsResponse. */
  async createCommunity(createdBy, payload = {}) {
    const created = await request('/v1/communities', {
      method: 'POST',
      body: {
        name: payload.name,
        description: payload.description,
        languageId: numericOrNull(payload.languageId),
        locationCountry: payload.locationCountry,
        locationCity: payload.locationCity,
        publicCommunity: payload.isPublic ?? true
      }
    });
    return detailsToCommunity(created);
  },

  /** `GET /v1/posts/feed?communityId=` → community post feed. */
  async getPosts(communityId) {
    const rows = await fetchPage(`/v1/posts/feed?communityId=${communityId}&size=100`);
    return rows.map(postToFrontend);
  },

  /** `POST /v1/posts/create`. */
  async createPost(communityId, userId, content, imageUrl) {
    const created = await request('/v1/posts/create', {
      method: 'POST',
      body: {
        communityId: Number(communityId),
        content,
        imageUrl: imageUrl ?? undefined
      }
    });
    return postToFrontend(created);
  },

  /**
   * Toggles the caller's reaction on a post. The endpoint errors when the
   * user already reacted, so the current state is checked first.
   */
  async likePost(postId) {
    const details = await request(`/v1/posts/${postId}`);
    if (details?.likedByMe) {
      await request(`/v1/posts/${postId}/reactions`, { method: 'DELETE' });
      return postToFrontend({ ...details, likedByMe: false, likeCount: Math.max(0, (details.likeCount ?? 1) - 1) });
    }
    await request(`/v1/posts/${postId}/reactions`, {
      method: 'POST',
      body: { type: 'LIKE' }
    });
    return postToFrontend({ ...details, likedByMe: true, likeCount: (details.likeCount ?? 0) + 1 });
  }
};
