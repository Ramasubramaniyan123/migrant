export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface ConversationParticipant {
  id: string;
  fullName: string;
  avatar: string;
  motherTongue: string;
  hometown: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  status: MessageStatus;
  timestamp: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participant: ConversationParticipant;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageRequest {
  receiverId: string;
  content: string;
}

export interface CreateConversationRequest {
  participantId: string;
  initialMessage?: string;
}

export interface MessageGroup {
  date: string;
  messages: Message[];
}
