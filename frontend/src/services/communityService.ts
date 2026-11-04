import { api } from './api';
import type { Community, Post, Comment, CreatePostRequest, CreateCommentRequest } from '@/types';

export const communityService = {
  async getCommunities(): Promise<Community[]> {
    const response = await api.get<Community[]>('/communities');
    return response.data;
  },

  async getCommunityById(id: string): Promise<Community> {
    const response = await api.get<Community>(`/communities/${id}`);
    return response.data;
  },

  async joinCommunity(communityId: string): Promise<void> {
    await api.post(`/communities/${communityId}/join`);
  },

  async leaveCommunity(communityId: string): Promise<void> {
    await api.post(`/communities/${communityId}/leave`);
  },

  async getCommunityPosts(communityId: string): Promise<Post[]> {
    const response = await api.get<Post[]>(`/communities/${communityId}/posts`);
    return response.data;
  },

  async createPost(data: CreatePostRequest): Promise<Post> {
    const response = await api.post<Post>('/posts', data);
    return response.data;
  },

  async getPostById(postId: string): Promise<Post> {
    const response = await api.get<Post>(`/posts/${postId}`);
    return response.data;
  },

  async likePost(postId: string): Promise<void> {
    await api.post(`/posts/${postId}/like`);
  },

  async unlikePost(postId: string): Promise<void> {
    await api.delete(`/posts/${postId}/like`);
  },

  async getPostComments(postId: string): Promise<Comment[]> {
    const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
    return response.data;
  },

  async createComment(data: CreateCommentRequest): Promise<Comment> {
    const response = await api.post<Comment>('/comments', data);
    return response.data;
  },

  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  },
};
