import apiClient from './api/apiClient';

const postService = {
  // Get feed
  getFeed: async (communityId = null, page = 0, size = 20) => {
    const params = new URLSearchParams({ page, size });
    if (communityId) params.append('communityId', communityId);
    
    const response = await apiClient.get(`/posts/feed?${params.toString()}`);
    return response.data;
  },

  // Get my posts
  getMyPosts: async (page = 0, size = 20) => {
    const params = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/posts/mine?${params.toString()}`);
    return response.data;
  },

  // Get post details
  getPost: async (id) => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  },

  // Create post
  createPost: async (data) => {
    const response = await apiClient.post('/posts/create', data);
    return response.data;
  },

  // Update post
  updatePost: async (id, content, imageUrl = null) => {
    const response = await apiClient.put(`/posts/${id}`, { content, imageUrl });
    return response.data;
  },

  // Delete post
  deletePost: async (id) => {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  },

  // Get comments
  getComments: async (postId, page = 0, size = 50) => {
    const params = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/posts/${postId}/comments?${params.toString()}`);
    return response.data;
  },

  // Add comment
  addComment: async (postId, content) => {
    const response = await apiClient.post('/posts/comments', { postId, content });
    return response.data;
  },

  // Update comment
  updateComment: async (commentId, content) => {
    const response = await apiClient.put(`/posts/comments/${commentId}`, { content });
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const response = await apiClient.delete(`/posts/comments/${commentId}`);
    return response.data;
  },

  // React to post
  reactToPost: async (postId, type) => {
    const response = await apiClient.post(`/posts/${postId}/reactions`, { type });
    return response.data;
  },

  // Remove reaction
  removeReaction: async (postId) => {
    const response = await apiClient.delete(`/posts/${postId}/reactions`);
    return response.data;
  },
};

export default postService;
