import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { useApp } from '@/store/AppProvider'
import { formatRelative, formatTime } from '@/lib/dates'
import { cn } from '@/lib/cn'

export function MessagesPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, currentUser, sendMessage, isConnected } = useApp()
  const [draft, setDraft] = useState('')

  const conversations = useMemo(() => {
    if (!currentUser) return []
    return state.conversations
      .filter((item) => item.participantIds.includes(currentUser.id))
      .map((item) => {
        const otherId = item.participantIds.find((value) => value !== currentUser.id)!
        const other = state.users.find((user) => user.id === otherId)
        const messages = state.messages.filter((message) => message.conversationId === item.id)
        const last = messages[messages.length - 1]
        return { item, other, last, messages }
      })
      .filter((row) => row.other && isConnected(row.other.id))
      .sort((a, b) => (b.last?.createdAt ?? '').localeCompare(a.last?.createdAt ?? ''))
  }, [state, currentUser, isConnected])

  if (!currentUser) return null
  const active = conversations.find((row) => row.other?.id === id) ?? conversations[0]
  const showThread = Boolean(id) || window.innerWidth >= 768

  return (
    <div className="grid min-h-[70vh] overflow-hidden rounded-2xl border border-line bg-card md:grid-cols-[300px_1fr]">
      <aside className={cn('border-r border-line', id ? 'hidden md:block' : 'block')}>
        <div className="border-b border-line p-4">
          <h1 className="text-lg font-semibold">Messages</h1>
          <p className="text-xs text-muted">Only accepted connections</p>
        </div>
        {conversations.length === 0 ? (
          <div className="p-4">
            <EmptyState title="No conversations" body="Accept a connection to start messaging." />
          </div>
        ) : (
          conversations.map((row) => (
            <button
              key={row.item.id}
              onClick={() => navigate(`/app/messages/${row.other!.id}`)}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-canvas',
                active?.other?.id === row.other?.id && 'bg-brand-soft',
              )}
            >
              <Avatar src={row.other!.photo} name={row.other!.name} />
              <div className="min-w-0">
                <p className="truncate font-medium">{row.other!.name}</p>
                <p className="truncate text-xs text-muted">{row.last?.text ?? 'Say hello'}</p>
              </div>
              <span className="ml-auto shrink-0 text-[10px] text-muted">{row.last ? formatRelative(row.last.createdAt) : ''}</span>
            </button>
          ))
        )}
      </aside>
      <section className={cn('flex min-h-[70vh] flex-col', !id && 'hidden md:flex')}>
        {!active || !showThread ? (
          <div className="m-auto p-8">
            <EmptyState title="Select a conversation" body="Choose someone from the left to continue a thread." />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Button variant="ghost" className="md:hidden" onClick={() => navigate('/app/messages')}>
                Back
              </Button>
              <Avatar src={active.other!.photo} name={active.other!.name} />
              <div>
                <p className="font-semibold">{active.other!.name}</p>
                <p className="text-xs text-muted">
                  {active.other!.motherTongue} · {active.other!.hometown}
                </p>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {active.messages.map((message) => {
                const mine = message.senderId === currentUser.id
                return (
                  <div key={message.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[75%] rounded-2xl px-3 py-2 text-sm', mine ? 'bg-brand text-white' : 'bg-canvas')}>
                      <p>{message.text}</p>
                      <p className={cn('mt-1 text-[10px]', mine ? 'text-white/70' : 'text-muted')}>{formatTime(message.createdAt)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <form
              className="flex gap-2 border-t border-line p-3"
              onSubmit={(event) => {
                event.preventDefault()
                sendMessage(active.other!.id, draft)
                setDraft('')
              }}
            >
              <Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message" />
              <Button type="submit">Send</Button>
            </form>
          </>
        )}
      </section>
    </div>
  )
}
