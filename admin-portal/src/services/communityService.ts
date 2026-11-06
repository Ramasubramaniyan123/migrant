import type { Community, CommunityMember, CommunityType } from '@/types/community.types'
import { MOCK_COMMUNITIES, MOCK_COMMUNITY_MEMBERS } from '@/data/mockCommunities'
import { clone } from '@/utils/helpers'
import { mockRequest, MockStore } from './api'

const store = new MockStore<Community>('admin_portal_communities', () => clone(MOCK_COMMUNITIES))
const memberStore = new MockStore<CommunityMember>(
  'admin_portal_community_members',
  () => clone(MOCK_COMMUNITY_MEMBERS),
)

export interface CommunityListParams {
  search?: string
  type?: CommunityType | 'ALL'
  city?: string
  status?: 'ALL' | 'ACTIVE' | 'INACTIVE'
  page?: number
  pageSize?: number
}

export const communityService = {
  async list(params: CommunityListParams = {}) {
    return mockRequest(() => {
      const { search = '', type = 'ALL', city = 'ALL', status = 'ALL' } = params
      const page = params.page ?? 1
      const pageSize = params.pageSize ?? 10

      let items = store.all()
      const q = search.trim().toLowerCase()
      if (q) items = items.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
      if (type !== 'ALL') items = items.filter((c) => c.type === type)
      if (city !== 'ALL') items = items.filter((c) => c.city === city)
      if (status === 'ACTIVE') items = items.filter((c) => c.isActive)
      if (status === 'INACTIVE') items = items.filter((c) => !c.isActive)

      const total = items.length
      const start = (page - 1) * pageSize
      return { items: items.slice(start, start + pageSize), total, page, pageSize }
    }, 400)
  },

  async getById(id: string) {
    return mockRequest(() => clone(store.find(id)), 250)
  },

  async create(payload: Omit<Community, 'id' | 'memberCount' | 'postCount' | 'createdAt'>) {
    return mockRequest(() => {
      return store.create({
        ...payload,
        memberCount: 1,
        postCount: 0,
        createdAt: new Date().toISOString(),
      })
    }, 400)
  },

  async update(id: string, patch: Partial<Community>) {
    return mockRequest(() => store.update(id, patch), 350)
  },

  async setActive(id: string, isActive: boolean) {
    return mockRequest(() => store.update(id, { isActive }), 300)
  },

  async delete(id: string) {
    return mockRequest(() => {
      if (!store.remove(id)) throw new Error('Community not found')
    }, 350)
  },

  async listMembers(communityId: string) {
    return mockRequest(() => clone(memberStore.findMany((m) => m.communityId === communityId)), 300)
  },

  async getStats() {
    return mockRequest(() => {
      const all = store.all()
      return {
        total: all.length,
        active: all.filter((c) => c.isActive).length,
        totalMembers: all.reduce((s, c) => s + c.memberCount, 0),
        byType: all.reduce<Record<string, number>>((acc, c) => {
          acc[c.type] = (acc[c.type] ?? 0) + 1
          return acc
        }, {}),
      }
    }, 300)
  },
}
