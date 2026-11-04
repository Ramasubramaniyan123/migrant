import React, { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import type { Conversation, Message } from '@/types';

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onBack: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
}) => {
  const [inputText, setInputText] = useState('');
  const p = conversation.participant;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50">
      {/* Top Header */}
      <div className="p-3 sm:p-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex min-w-0 items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="md:hidden shrink-0 p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Avatar src={p?.avatar} name={p?.fullName || 'User'} size="md" />
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-gray-900">{p?.fullName}</h3>
            <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-gray-500">
              {p?.motherTongue && <span>{p.motherTongue}</span>}
              {p?.hometown && <span>• {p.hometown}</span>}
              <span className="text-emerald-600 font-medium">
                {p?.isOnline ? '• Online' : '• Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Message stream */}
      <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-sm rounded-2xl px-4 py-2 text-xs leading-relaxed ${
                  isMe
                    ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-xs shadow-xs'
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">
                {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${p?.fullName}...`}
          className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!inputText.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 py-2 px-3"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
