import type { Post, PostComment } from '@/types/post.types'
import { MOCK_POSTS, MOCK_POST_COMMENTS } from '@/data/mockPosts'
import { clone } from '@/utils/helpers'
import { mockRequest, MockStore } from './api'

const store = new MockStore<Post>('admin_portal_posts', () => clone(MOCK_POSTS))
const commentStore = new MockStore<PostComment>(
  'admin_portal_post_comments',
  () => clone(MOCK_POST_COMMENTS),
)

export const postService = {
  async list(params: { search?: string; flaggedOnly?: boolean; page?: number; pageSize?: number } = {}) {
    return mockRequest(() => {
      const { search = '', flaggedOnly = false } = params
      const page = params.page ?? 1
      const pageSize = params.pageSize ?? 10

      let items = store.all()
      const q = search.trim().toLowerCase()
      if (q) {
        items = items.filter(
          (p) => p.content.toLowerCase().includes(q) || p.authorName.toLowerCase().includes(q),
        )
      }
      if (flaggedOnly) items = items.filter((p) => p.isFlagged)
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

      const total = items.length
      const start = (page - 1) * pageSize
      return { items: items.slice(start, start + pageSize), total, page, pageSize }
    }, 350)
  },

  async getById(id: string) {
    return mockRequest(() => clone(store.find(id)), 250)
  },

  async getComments(postId: string) {
    return mockRequest(() => clone(commentStore.findMany((c) => c.postId === postId)), 250)
  },

  async setFlagged(id: string, isFlagged: boolean) {
    return mockRequest(() => store.update(id, { isFlagged }), 300)
  },

  async remove(id: string) {
    return mockRequest(() => {
      if (!store.remove(id)) throw new Error('Post not found')
    }, 350)
  },

  async getStats() {
    return mockRequest(() => {
      const all = store.all()
      return {
        total: all.length,
        flagged: all.filter((p) => p.isFlagged).length,
        totalLikes: all.reduce((s, p) => s + p.likeCount, 0),
        totalComments: all.reduce((s, p) => s + p.commentCount, 0),
      }
    }, 250)
  },
}
