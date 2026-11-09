import { request } from './api';

/* ------------------------------------------------------------------ *
 * Messaging — REST polling against `/v1/messaging` (the STOMP/WebSocket *
 * channel exists but the UI polls, so no socket wiring is required).    *
 * ------------------------------------------------------------------ */

function memberToPeer(members, userId) {
  const id = Number(userId);
  return (members ?? []).find(member => Number(member.userId) !== id) ?? members?.[0];
}

function toConversationSummary(dto, userId) {
  const peer = memberToPeer(dto.members, userId);
  return {
    conversation: {
      id: Number(dto.id),
      createdBy: Number(userId),
      createdAt: dto.lastMessageAt ?? new Date(0).toISOString(),
      updatedAt: dto.lastMessageAt ?? new Date(0).toISOString()
    },
    peerId: peer ? Number(peer.userId) : Number(userId),
    peer: peer
      ? { userId: Number(peer.userId), displayName: peer.displayName, avatarUrl: peer.avatarUrl }
      : undefined,
    lastMessage: dto.lastMessage
      ? {
          id: null,
          conversationId: Number(dto.id),
          senderId: peer ? Number(peer.userId) : undefined,
          content: dto.lastMessage,
          isRead: true,
          createdAt: dto.lastMessageAt
        }
      : undefined,
    unreadCount: dto.unreadCount ?? 0
  };
}

function toMessage(dto) {
  return {
    id: Number(dto.id),
    conversationId: Number(dto.conversationId),
    senderId: Number(dto.senderId),
    senderName: dto.senderName ?? undefined,
    content: dto.content ?? '',
    isRead: Boolean(dto.read),
    createdAt: dto.createdAt
  };
}

async function fetchPage(path) {
  const page = await request(path);
  return page?.content ?? [];
}

export const messageService = {
  async getConversations(userId) {
    const rows = await fetchPage('/v1/messaging/conversations?size=100');
    return rows
      .map(dto => toConversationSummary(dto, userId))
      .sort(
        (a, b) =>
          Date.parse(b.lastMessage?.createdAt ?? b.conversation.updatedAt) -
          Date.parse(a.lastMessage?.createdAt ?? a.conversation.updatedAt)
      );
  },

  async getMessages(conversationId) {
    const rows = await fetchPage(`/v1/messaging/conversations/${conversationId}/messages?size=100`);
    return rows
      .map(toMessage)
      .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
  },

  async sendMessage(conversationId, senderId, content) {
    const sent = await request('/v1/messaging/send', {
      method: 'POST',
      body: { conversationId: Number(conversationId), content: content.trim() }
    });
    return toMessage(sent);
  },

  async markConversationRead(conversationId, userId) {
    await request(`/v1/messaging/conversations/${conversationId}/read`, { method: 'POST' });
  },

  /** `POST /v1/messaging/conversations` creates-or-returns the 1:1 thread. */
  async getOrCreateConversation(userId, otherUserId) {
    const summary = await request('/v1/messaging/conversations', {
      method: 'POST',
      body: { userId: Number(otherUserId) }
    });
    const mapped = toConversationSummary(summary, userId);
    return mapped.conversation;
  }
};
