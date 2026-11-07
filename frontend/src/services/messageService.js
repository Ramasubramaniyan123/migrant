import messagesSeed from '@/data/messages.json';
import { clone } from '@/utils/helpers';
import { mockResponse, nextId } from './api';
const store = clone(messagesSeed);
function peerIdFor(conversationId, userId) {
  const peer = store.members.find(member => member.conversationId === conversationId && member.userId !== userId);
  return peer?.userId ?? userId;
}
export const messageService = {
  async getConversations(userId) {
    const summaries = store.conversations.filter(conversation => store.members.some(member => member.conversationId === conversation.id && member.userId === userId)).map(conversation => {
      const threadMessages = store.messages.filter(message => message.conversationId === conversation.id).sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
      return {
        conversation,
        peerId: peerIdFor(conversation.id, userId),
        lastMessage: threadMessages.at(-1),
        unreadCount: threadMessages.filter(message => message.senderId !== userId && !message.isRead).length
      };
    }).sort((a, b) => Date.parse(b.lastMessage?.createdAt ?? b.conversation.updatedAt) - Date.parse(a.lastMessage?.createdAt ?? a.conversation.updatedAt));
    return mockResponse(summaries);
  },
  async getMessages(conversationId) {
    const thread = store.messages.filter(message => message.conversationId === conversationId).sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    return mockResponse(thread);
  },
  async sendMessage(conversationId, senderId, content) {
    const now = new Date().toISOString();
    const message = {
      id: nextId(store.messages),
      conversationId,
      senderId,
      content: content.trim(),
      isRead: false,
      createdAt: now
    };
    store.messages.push(message);
    const conversation = store.conversations.find(row => row.id === conversationId);
    if (conversation) conversation.updatedAt = now;
    return mockResponse(message, 120);
  },
  async markConversationRead(conversationId, userId) {
    store.messages.forEach(message => {
      if (message.conversationId === conversationId && message.senderId !== userId) {
        message.isRead = true;
      }
    });
    const member = store.members.find(row => row.conversationId === conversationId && row.userId === userId);
    if (member) member.lastReadAt = new Date().toISOString();
    return mockResponse(undefined, 60);
  },
  async getOrCreateConversation(userId, otherUserId) {
    const existing = store.conversations.find(conversation => {
      const memberIds = store.members.filter(member => member.conversationId === conversation.id).map(member => member.userId);
      return memberIds.includes(userId) && memberIds.includes(otherUserId);
    });
    if (existing) return mockResponse(existing);
    const now = new Date().toISOString();
    const conversation = {
      id: nextId(store.conversations),
      createdBy: userId,
      createdAt: now,
      updatedAt: now
    };
    store.conversations.push(conversation);
    store.members.push({
      id: nextId(store.members),
      conversationId: conversation.id,
      userId
    }, {
      id: nextId(store.members) + 1,
      conversationId: conversation.id,
      userId: otherUserId
    });
    return mockResponse(conversation);
  }
};
