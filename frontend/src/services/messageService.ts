import { api } from './api';
import type { Conversation, Message, SendMessageRequest, CreateConversationRequest } from '@/types';

export const messageService = {
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get<Conversation[]>('/conversations');
    return response.data;
  },

  async getConversationById(id: string): Promise<Conversation> {
    const response = await api.get<Conversation>(`/conversations/${id}`);
    return response.data;
  },

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    const response = await api.get<Message[]>(`/conversations/${conversationId}/messages`);
    return response.data;
  },

  async sendMessage(data: SendMessageRequest): Promise<Message> {
    const response = await api.post<Message>('/messages', data);
    return response.data;
  },

  async createConversation(data: CreateConversationRequest): Promise<Conversation> {
    const response = await api.post<Conversation>('/conversations', data);
    return response.data;
  },

  async markMessageAsRead(messageId: string): Promise<void> {
    await api.put(`/messages/${messageId}/read`);
  },

  async markConversationAsRead(conversationId: string): Promise<void> {
    await api.put(`/conversations/${conversationId}/read`);
  },
};
