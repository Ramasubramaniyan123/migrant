import type { Language } from '@/types/language.types'
import { MOCK_LANGUAGES } from '@/data/mockLanguages'
import { clone } from '@/utils/helpers'
import { mockRequest, MockStore } from './api'

const store = new MockStore<Language>('admin_portal_languages', () => clone(MOCK_LANGUAGES))

export const languageService = {
  async list(): Promise<Language[]> {
    return mockRequest(() => store.all())
  },

  async create(payload: { name: string; nativeName: string; code: string }): Promise<Language> {
    return mockRequest(() => {
      const code = payload.code.trim().toLowerCase()
      const exists = store.findMany((l) => l.code === code)[0]
      if (exists) throw new Error('A language with this code already exists')
      return store.create({
        name: payload.name.trim(),
        nativeName: payload.nativeName.trim(),
        code,
        isActive: true,
        userCount: 0,
        communityCount: 0,
      })
    }, 400)
  },

  async update(id: string, patch: Partial<Pick<Language, 'name' | 'nativeName' | 'code' | 'isActive'>>) {
    return mockRequest(() => store.update(id, patch), 350)
  },

  async setActive(id: string, isActive: boolean) {
    return mockRequest(() => store.update(id, { isActive }), 300)
  },

  async getStats() {
    return mockRequest(() => {
      const all = store.all()
      return {
        total: all.length,
        active: all.filter((l) => l.isActive).length,
        totalUsers: all.reduce((s, l) => s + l.userCount, 0),
      }
    }, 250)
  },
}
