import api from '../api/axiosInstance'
import { unwrap, normalizePage } from '../api/apiClient'

export const postService = {
  feed: async ({ communityId, page = 0, size = 20 } = {}) => {
    const data = unwrap(await api.get('/v1/posts/feed', { params: { communityId, page, size } }))
    return normalizePage(data)
  },
  mine: async ({ page = 0, size = 20 } = {}) => {
    const data = unwrap(await api.get('/v1/posts/mine', { params: { page, size } }))
    return normalizePage(data)
  },
  get: async (id) => unwrap(await api.get(`/v1/posts/${id}`)),
  create: async ({ communityId, content, imageUrl, imageUrls }) =>
    unwrap(await api.post('/v1/posts/create', { communityId, content, imageUrl, imageUrls })),
  update: async (id, data) => unwrap(await api.put(`/v1/posts/${id}`, data)),
  remove: async (id) => unwrap(await api.delete(`/v1/posts/${id}`)),
  comments: async (id, { page = 0, size = 50 } = {}) => {
    const data = unwrap(await api.get(`/v1/posts/${id}/comments`, { params: { page, size } }))
    return normalizePage(data)
  },
  addComment: async ({ postId, parentCommentId, content }) =>
    unwrap(await api.post('/v1/posts/comments', { postId, parentCommentId, content })),
  updateComment: async (commentId, content) =>
    unwrap(await api.put(`/v1/posts/comments/${commentId}`, { content })),
  deleteComment: async (commentId) =>
    unwrap(await api.delete(`/v1/posts/comments/${commentId}`)),
  react: async (id) => unwrap(await api.post(`/v1/posts/${id}/reactions`)),
  unreact: async (id) => unwrap(await api.delete(`/v1/posts/${id}/reactions`)),
}
