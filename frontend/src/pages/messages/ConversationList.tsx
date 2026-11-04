import React from 'react';
import { Avatar } from '@/components/common/Avatar';
import { Search } from 'lucide-react';
import type { Conversation } from '@/types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
}) => {
  const filtered = conversations.filter((c) =>
    c.participant?.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full md:w-80 border-r border-gray-200 flex flex-col h-full bg-white">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Conversations scroll list */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {filtered.map((conv) => {
          const isSelected = conv.id === selectedId;
          const p = conv.participant;
          return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`w-full p-3.5 flex items-center space-x-3 text-left transition-colors ${
                isSelected
                  ? 'bg-indigo-50/70 border-r-2 border-indigo-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative shrink-0">
                <Avatar src={p?.avatar} name={p?.fullName || 'User'} size="md" />
                {p?.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs text-gray-900 truncate">
                    {p?.fullName}
                  </h4>
                  <span className="text-[10px] text-gray-400">
                    {conv.lastMessage?.timestamp
                      ? new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : ''}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 truncate mt-0.5">
                  {conv.lastMessage?.content || 'Start a conversation'}
                </p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {conv.unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

