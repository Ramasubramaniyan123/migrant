import messagesSeed from '@/data/messages.json'
import type {
  Conversation,
  ConversationMember,
  ConversationSummary,
  Message,
} from '@/types/message.types'
import { clone } from '@/utils/helpers'
import { mockResponse, nextId } from './api'

interface MessageSeed {
  conversations: Conversation[]
  members: ConversationMember[]
  messages: Message[]
}

const store: MessageSeed = clone(messagesSeed) as unknown as MessageSeed

function peerIdFor(conversationId: number, userId: number): number {
  const peer = store.members.find(
    (member) => member.conversationId === conversationId && member.userId !== userId,
  )
  return peer?.userId ?? userId
}

export const messageService = {
  async getConversations(userId: number): Promise<ConversationSummary[]> {
    const summaries = store.conversations
      .filter((conversation) =>
        store.members.some(
          (member) => member.conversationId === conversation.id && member.userId === userId,
        ),
      )
      .map<ConversationSummary>((conversation) => {
        const threadMessages = store.messages
          .filter((message) => message.conversationId === conversation.id)
          .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))

        return {
          conversation,
          peerId: peerIdFor(conversation.id, userId),
          lastMessage: threadMessages.at(-1),
          unreadCount: threadMessages.filter(
            (message) => message.senderId !== userId && !message.isRead,
          ).length,
        }
      })
      .sort(
        (a, b) =>
          Date.parse(b.lastMessage?.createdAt ?? b.conversation.updatedAt) -
          Date.parse(a.lastMessage?.createdAt ?? a.conversation.updatedAt),
      )

    return mockResponse(summaries)
  },

  async getMessages(conversationId: number): Promise<Message[]> {
    const thread = store.messages
      .filter((message) => message.conversationId === conversationId)
      .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
    return mockResponse(thread)
  },

  async sendMessage(conversationId: number, senderId: number, content: string): Promise<Message> {
    const now = new Date().toISOString()
    const message: Message = {
      id: nextId(store.messages),
      conversationId,
      senderId,
      content: content.trim(),
      isRead: false,
      createdAt: now,
    }
    store.messages.push(message)

    const conversation = store.conversations.find((row) => row.id === conversationId)
    if (conversation) conversation.updatedAt = now

    return mockResponse(message, 120)
  },

  async markConversationRead(conversationId: number, userId: number): Promise<void> {
    store.messages.forEach((message) => {
      if (message.conversationId === conversationId && message.senderId !== userId) {
        message.isRead = true
      }
    })
    const member = store.members.find(
      (row) => row.conversationId === conversationId && row.userId === userId,
    )
    if (member) member.lastReadAt = new Date().toISOString()
    return mockResponse(undefined, 60)
  },

  async getOrCreateConversation(userId: number, otherUserId: number): Promise<Conversation> {
    const existing = store.conversations.find((conversation) => {
      const memberIds = store.members
        .filter((member) => member.conversationId === conversation.id)
        .map((member) => member.userId)
      return memberIds.includes(userId) && memberIds.includes(otherUserId)
    })
    if (existing) return mockResponse(existing)

    const now = new Date().toISOString()
    const conversation: Conversation = {
      id: nextId(store.conversations),
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    }
    store.conversations.push(conversation)
    store.members.push(
      { id: nextId(store.members), conversationId: conversation.id, userId },
      {
        id: nextId(store.members) + 1,
        conversationId: conversation.id,
        userId: otherUserId,
      },
    )

    return mockResponse(conversation)
  },
}
