import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { messageService } from '@/services/messageService';
import { fullName } from '@/services/userService';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import { ROUTES } from '@/utils/constants';
import { formatClockTime } from '@/utils/formatters';
import { cn } from '@/utils/helpers';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import { Textarea } from '@/components/common/Input';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';
/** Message thread with a composer for a single conversation. */
export default function ChatWindow({
  conversationId,
  peerId,
  onSent
}) {
  const {
    user
  } = useAuth();
  const {
    getUserById
  } = useUsers();
  const currentUserId = user?.id;
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef(null);
  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const thread = await messageService.getMessages(conversationId);
      setMessages(thread);
      if (currentUserId) {
        await messageService.markConversationRead(conversationId, currentUserId);
      }
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, currentUserId]);
  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);
  const peer = getUserById(peerId);
  const peerName = peer ? fullName(peer) : 'Unknown member';
  const hometown = [peer?.profile.hometownCity, peer?.profile.hometownCountry].filter(Boolean).join(', ');
  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !currentUserId) return;
    setIsSending(true);
    try {
      await messageService.sendMessage(conversationId, currentUserId, content);
      setDraft('');
      await loadMessages();
      onSent?.();
    } finally {
      setIsSending(false);
    }
  };
  const handleKeyDown = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };
  if (!currentUserId) {
    return <EmptyState title="Sign in required" description="Please sign in to read your messages." />;
  }
  return <div className="flex h-full flex-col overflow-hidden">
      <header className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
        <Avatar name={peerName} src={peer?.profile.avatarUrl} size="md" />
        <div className="min-w-0">
          <Link to={ROUTES.userProfile(peerId)} className="truncate text-sm font-semibold text-slate-900 hover:underline">
            {peerName}
          </Link>
          {hometown && <p className="truncate text-xs text-slate-500">From {hometown}</p>}
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
        {isLoading ? <Loader label="Loading messages…" /> : messages.length === 0 ? <EmptyState title="No messages yet" description={`Say hello to ${peerName}.`} /> : messages.map(message => {
        const isOwn = message.senderId === currentUserId;
        return <div key={message.id} className={cn('flex items-end gap-2', isOwn ? 'justify-end' : 'justify-start')}>
                {!isOwn && <Avatar name={peerName} src={peer?.profile.avatarUrl} size="sm" />}
                <div className={cn('max-w-[75%] rounded-2xl px-3.5 py-2 text-sm shadow-sm', isOwn ? 'bg-brand-600 text-white' : 'border border-slate-200 bg-white text-slate-800')}>
                  <p className="whitespace-pre-line break-words">{message.content}</p>
                  <p className={cn('mt-1 text-right text-[10px]', isOwn ? 'text-brand-100' : 'text-slate-400')}>
                    {formatClockTime(message.createdAt)}
                  </p>
                </div>
              </div>;
      })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-100 p-3">
        <div className="flex items-end gap-2">
          <Textarea value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={handleKeyDown} rows={1} placeholder="Write a message… (Enter to send, Shift+Enter for a new line)" className="flex-1" />
          <Button onClick={() => void handleSend()} isLoading={isSending} disabled={!draft.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>;
}
