import { fullName } from '@/services/userService';
import { useUsers } from '@/hooks/useUsers';
import { formatRelativeTime, truncate } from '@/utils/formatters';
import { cn } from '@/utils/helpers';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';
/** Scrollable list of conversations with peer name, preview and unread count. */
export default function ConversationList({
  summaries,
  activeConversationId,
  isLoading = false,
  onSelect
}) {
  const {
    getUserById
  } = useUsers();
  if (isLoading) {
    return <Loader label="Loading conversations…" />;
  }
  if (summaries.length === 0) {
    return <EmptyState title="No conversations" description="Start a chat from a profile or one of your connections." />;
  }
  return <div className="flex h-full flex-col overflow-y-auto">
      {summaries.map(summary => {
      const peer = getUserById(summary.peerId);
      const name = peer ? fullName(peer) : 'Unknown member';
      const isActive = summary.conversation.id === activeConversationId;
      return <button key={summary.conversation.id} type="button" onClick={() => onSelect(summary.conversation.id)} className={cn('flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition', isActive ? 'bg-brand-50' : 'hover:bg-slate-50')}>
            <Avatar name={name} src={peer?.profile.avatarUrl} size="md" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-slate-900">{name}</span>
                {summary.lastMessage && <span className="shrink-0 text-xs text-slate-400">
                    {formatRelativeTime(summary.lastMessage.createdAt)}
                  </span>}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs text-slate-500">
                  {summary.lastMessage ? truncate(summary.lastMessage.content, 42) : 'No messages yet'}
                </span>
                {summary.unreadCount > 0 && <Badge variant="brand" size="sm">
                    {summary.unreadCount}
                  </Badge>}
              </div>
            </div>
          </button>;
    })}
    </div>;
}
