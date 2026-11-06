export interface Conversation {
  id: number
  createdBy: number
  createdAt: string
  updatedAt: string
}

export interface ConversationMember {
  id: number
  conversationId: number
  userId: number
  lastReadAt?: string
}

export interface Message {
  id: number
  conversationId: number
  senderId: number
  content: string
  isRead: boolean
  createdAt: string
}

/** Conversation enriched with the other participant and the last message. */
export interface ConversationSummary {
  conversation: Conversation
  peerId: number
  lastMessage?: Message
  unreadCount: number
}
