import communitiesSeed from '@/data/communities.json'
import postsSeed from '@/data/posts.json'
import type { Community, CommunityMember, Post } from '@/types/community.types'
import { clone } from '@/utils/helpers'
import { mockResponse, nextId } from './api'

const communityStore: Community[] = clone(communitiesSeed) as unknown as Community[]
let postStore: Post[] = clone(postsSeed) as unknown as Post[]
let memberships: CommunityMember[] = [
  { id: 1, communityId: 1, userId: 1, role: 'ADMIN', joinedAt: '2025-06-02T10:00:00Z' },
  { id: 2, communityId: 2, userId: 1, role: 'MEMBER', joinedAt: '2025-07-01T10:00:00Z' },
  { id: 3, communityId: 3, userId: 1, role: 'MEMBER', joinedAt: '2025-07-20T10:00:00Z' },
  { id: 4, communityId: 2, userId: 2, role: 'ADMIN', joinedAt: '2025-06-18T10:00:00Z' },
  { id: 5, communityId: 3, userId: 9, role: 'ADMIN', joinedAt: '2025-07-04T10:00:00Z' },
  { id: 6, communityId: 4, userId: 8, role: 'ADMIN', joinedAt: '2025-07-22T10:00:00Z' },
  { id: 7, communityId: 5, userId: 4, role: 'ADMIN', joinedAt: '2025-08-09T10:00:00Z' },
  { id: 8, communityId: 6, userId: 11, role: 'ADMIN', joinedAt: '2025-08-27T10:00:00Z' },
  { id: 9, communityId: 1, userId: 5, role: 'MEMBER', joinedAt: '2025-08-01T10:00:00Z' },
  { id: 10, communityId: 1, userId: 10, role: 'MEMBER', joinedAt: '2025-08-14T10:00:00Z' },
]

export const communityService = {
  async getCommunities(search = ''): Promise<Community[]> {
    const query = search.trim().toLowerCase()
    const rows = query
      ? communityStore.filter((community) =>
          `${community.name} ${community.description} ${community.locationCity ?? ''}`
            .toLowerCase()
            .includes(query),
        )
      : communityStore
    return mockResponse(rows)
  },

  async getCommunityById(id: number): Promise<Community> {
    const community = communityStore.find((row) => row.id === id)
    if (!community) throw new Error(`Community ${id} not found`)
    return mockResponse(community)
  },

  async getMembershipsForUser(userId: number): Promise<CommunityMember[]> {
    return mockResponse(memberships.filter((row) => row.userId === userId))
  },

  async getMembersForCommunity(communityId: number): Promise<CommunityMember[]> {
    return mockResponse(memberships.filter((row) => row.communityId === communityId))
  },

  async isMember(userId: number, communityId: number): Promise<boolean> {
    return mockResponse(
      memberships.some((row) => row.userId === userId && row.communityId === communityId),
      80,
    )
  },

  async joinCommunity(userId: number, communityId: number): Promise<CommunityMember> {
    const existing = memberships.find(
      (row) => row.userId === userId && row.communityId === communityId,
    )
    if (existing) return mockResponse(existing)

    const membership: CommunityMember = {
      id: nextId(memberships),
      communityId,
      userId,
      role: 'MEMBER',
      joinedAt: new Date().toISOString(),
    }
    memberships = [...memberships, membership]

    const community = communityStore.find((row) => row.id === communityId)
    if (community) community.memberCount += 1

    return mockResponse(membership)
  },

  async leaveCommunity(userId: number, communityId: number): Promise<void> {
    memberships = memberships.filter(
      (row) => !(row.userId === userId && row.communityId === communityId),
    )
    const community = communityStore.find((row) => row.id === communityId)
    if (community) community.memberCount = Math.max(0, community.memberCount - 1)
    return mockResponse(undefined, 120)
  },

  async createCommunity(
    createdBy: number,
    payload: Pick<Community, 'name' | 'description' | 'languageId' | 'locationCity' | 'locationCountry'>,
  ): Promise<Community> {
    const community: Community = {
      id: nextId(communityStore),
      isPublic: true,
      memberCount: 1,
      createdBy,
      createdAt: new Date().toISOString(),
      ...payload,
    }
    communityStore.push(community)
    memberships = [
      ...memberships,
      {
        id: nextId(memberships),
        communityId: community.id,
        userId: createdBy,
        role: 'ADMIN',
        joinedAt: new Date().toISOString(),
      },
    ]
    return mockResponse(community)
  },

  async getPosts(communityId: number): Promise<Post[]> {
    return mockResponse(
      postStore
        .filter((post) => post.communityId === communityId)
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    )
  },

  async createPost(
    communityId: number,
    userId: number,
    content: string,
    imageUrl?: string | null,
  ): Promise<Post> {
    const post: Post = {
      id: nextId(postStore),
      communityId,
      userId,
      content,
      imageUrl: imageUrl ?? null,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
    }
    postStore = [post, ...postStore]
    return mockResponse(post)
  },

  async likePost(postId: number): Promise<Post> {
    const post = postStore.find((row) => row.id === postId)
    if (!post) throw new Error(`Post ${postId} not found`)
    post.likeCount += 1
    return mockResponse(post, 90)
  },
}
