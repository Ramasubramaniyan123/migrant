import React, { useState } from 'react';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { useAuth } from '@/hooks/useAuth';
import initialMessages from '@/data/messages.json';
import type { Conversation, Message } from '@/types';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const currentUserId = user?.id || 'user-demo';

  const [conversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      participantId: 'u-priya',
      participant: {
        id: 'u-priya',
        fullName: 'Priya Karthik',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
        motherTongue: 'Tamil',
        hometown: 'Madurai',
        isOnline: true,
      },
      lastMessage: {
        id: 'msg-3',
        conversationId: 'conv-1',
        senderId: 'u-priya',
        receiverId: 'user-demo',
        content: 'About 7 months now! Still getting used to the winter weather...',
        status: 'delivered',
        timestamp: '2026-11-03T16:32:00Z',
        createdAt: '2026-11-03T16:32:00Z',
      },
      unreadCount: 1,
      createdAt: '2026-11-03T16:00:00Z',
      updatedAt: '2026-11-03T16:32:00Z',
    },
    {
      id: 'conv-2',
      participantId: 'u-suresh',
      participant: {
        id: 'u-suresh',
        fullName: 'Suresh Varma',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh',
        motherTongue: 'Telugu',
        hometown: 'Visakhapatnam',
        isOnline: false,
      },
      lastMessage: {
        id: 'msg-4',
        conversationId: 'conv-2',
        senderId: 'u-suresh',
        receiverId: 'user-demo',
        content: 'Hey Arun! Are you up for tennis-ball cricket this Sunday at Sector 29?',
        status: 'delivered',
        timestamp: '2026-11-04T08:10:00Z',
        createdAt: '2026-11-04T08:10:00Z',
      },
      unreadCount: 0,
      createdAt: '2026-11-04T08:00:00Z',
      updatedAt: '2026-11-04T08:10:00Z',
    },
  ]);

  const [selectedConversationId, setSelectedConversationId] = useState<string>('conv-1');
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages as any[]);
  const [searchQuery, setSearchQuery] = useState('');

  const activeConversation = conversations.find((c) => c.id === selectedConversationId) || conversations[0];
  const activeMessages = messages.filter((m) => m.conversationId === selectedConversationId);

  const handleSendMessage = (text: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversationId,
      senderId: currentUserId,
      receiverId: activeConversation.participantId,
      content: text,
      status: 'sent',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);

    // Simulated auto-reply after 1.5 seconds for engaging prototype experience
    setTimeout(() => {
      const replyMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        conversationId: selectedConversationId,
        senderId: activeConversation.participantId,
        receiverId: currentUserId,
        content: `Sounds great! Let's definitely catch up near DLF Cyber Hub this weekend 👍`,
        status: 'delivered',
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100dvh-16rem)] min-h-[320px] md:h-[calc(100vh-12rem)] md:min-h-[500px] bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs flex flex-col md:flex-row">
      <div className={`${mobileChatOpen ? 'hidden' : 'flex'} min-h-0 flex-1 flex-col md:flex md:flex-none`}>
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversationId}
          onSelect={(id) => {
            setSelectedConversationId(id);
            setMobileChatOpen(true);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      {activeConversation && (
        <div className={`${mobileChatOpen ? 'flex' : 'hidden'} min-h-0 min-w-0 flex-1 flex-col md:flex`}>
          <ChatWindow
            conversation={activeConversation}
            messages={activeMessages}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            onBack={() => setMobileChatOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
