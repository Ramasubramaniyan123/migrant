import { useEffect, useState, useCallback, useRef } from 'react'
import { messagingService } from '../../services/messaging/messagingService'
import { useAuth } from '../../contexts'
import { errorMessage } from '../../services/api/apiClient'
import { Avatar } from '../../components/ui/Avatar'
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States'
import { timeAgo } from '../../utils/format'

const otherMember = (conv, myId) =>
  conv.members?.find((m) => String(m.userId) !== String(myId)) || conv.members?.[0] || {}

export const Messaging = () => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadConversations = useCallback(async () => {
    try {
      const page = await messagingService.conversations({ size: 50 })
      setConversations(page.items || [])
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadConversations()
    // Poll for new messages — the backend exposes REST endpoints for messaging.
    const interval = setInterval(loadConversations, 15000)
    return () => clearInterval(interval)
  }, [loadConversations])

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={loadConversations} />

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-6xl flex-col">
      <h1 className="mb-4 font-display text-2xl font-bold">Messages</h1>
      {conversations.length === 0 ? (
        <EmptyState
          title="No conversations yet"
          description="Connect with someone and start a conversation from their profile or the Connections page."
        />
      ) : (
        <div className={`grid flex-1 gap-4 md:grid-cols-[320px_1fr] ${activeId ? 'max-md:hidden' : ''}`}>
          <ConversationList
            conversations={conversations}
            activeId={activeId}
            myId={user?.id}
            onSelect={setActiveId}
          />
          <div className="hidden md:block">
            {activeId ? (
              <ConversationView conversationId={activeId} myId={user?.id} onRead={loadConversations} />
            ) : (
              <div className="card flex h-full items-center justify-center p-8 text-sm text-ink-3">
                Select a conversation to start messaging
              </div>
            )}
          </div>
          {/* Mobile: show active conversation full-width */}
          {activeId && (
            <div className="flex-1 md:hidden">
              <ConversationView conversationId={activeId} myId={user?.id} onRead={loadConversations} onBack={() => setActiveId(null)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const ConversationList = ({ conversations, activeId, myId, onSelect }) => (
  <div className="card max-h-full divide-y divide-line overflow-y-auto" role="listbox" aria-label="Conversations">
    {conversations.map((conv) => {
      const other = otherMember(conv, myId)
      return (
        <button
          key={conv.id}
          type="button"
          role="option"
          aria-selected={activeId === conv.id}
          onClick={() => onSelect(conv.id)}
          className={`flex w-full items-center gap-3 p-4 text-left transition-colors ${
            activeId === conv.id ? 'bg-accent-soft' : 'hover:bg-hover'
          }`}
        >
          <Avatar name={other.displayName} src={other.avatarUrl} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{other.displayName || 'Conversation'}</p>
            <p className="truncate text-xs text-ink-3">{conv.lastMessage || 'No messages yet'}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {conv.lastMessageAt && <span className="text-xs text-ink-3">{timeAgo(conv.lastMessageAt)}</span>}
            {conv.unreadCount > 0 && (
              <span className="badge bg-accent text-accent-ink">{conv.unreadCount}</span>
            )}
          </div>
        </button>
      )
    })}
  </div>
)

const ConversationView = ({ conversationId, myId, onRead, onBack }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  const load = useCallback(async () => {
    try {
      const page = await messagingService.history(conversationId, { size: 50 })
      const items = page.items || []
      // API returns newest-first pages; display oldest→newest.
      setMessages([...items].reverse())
      messagingService.markRead(conversationId).then(onRead).catch(() => {})
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [conversationId, onRead])

  useEffect(() => {
    setLoading(true)
    load()
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [load])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const send = async (e) => {
    e.preventDefault()
    const content = draft.trim()
    if (!content || sending) return
    setSending(true)
    try {
      await messagingService.send(conversationId, content)
      setDraft('')
      await load()
      onRead?.()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSending(false)
    }
  }

  if (loading) return <LoadingState />

  return (
    <div className="card flex h-full flex-col">
      {onBack && (
        <button type="button" onClick={onBack} className="border-b border-line px-4 py-2 text-sm text-accent md:hidden">
          ← Back to conversations
        </button>
      )}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {error && <ErrorState message={error} />}
        {messages.length === 0 && !error && (
          <p className="py-8 text-center text-sm text-ink-3">No messages yet. Say hello!</p>
        )}
        {messages.map((m) => {
          const mine = String(m.senderId) === String(myId)
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  mine ? 'bg-accent text-accent-ink' : 'bg-surface-alt text-ink'
                }`}
              >
                {!mine && <p className="mb-0.5 text-xs font-medium opacity-70">{m.senderName}</p>}
                <p className="whitespace-pre-line">{m.content}</p>
                <p className={`mt-1 text-[10px] ${mine ? 'opacity-70' : 'text-ink-3'}`}>
                  {m.createdAt ? timeAgo(m.createdAt) : ''}{m.read && mine ? ' · read' : ''}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-line p-3">
        <input
          className="input"
          placeholder="Type a message…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={4000}
          aria-label="Message"
        />
        <button type="submit" className="btn-accent" disabled={sending || !draft.trim()}>
          {sending ? '…' : 'Send'}
        </button>
      </form>
    </div>
  )
}
