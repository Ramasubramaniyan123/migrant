import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { ConversationSummary } from '@/types/message.types'
import { messageService } from '@/services/messageService'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/utils/constants'
import { cn } from '@/utils/helpers'
import EmptyState from '@/components/common/EmptyState'
import Loader from '@/components/common/Loader'
import ChatWindow from './ChatWindow'
import ConversationList from './ConversationList'

/** Two-pane messages screen that keeps the active conversation in the URL. */
export default function MessagesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { conversationId: conversationIdParam } = useParams<{ conversationId: string }>()
  const userId = user?.id

  const [summaries, setSummaries] = useState<ConversationSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadSummaries = useCallback(async () => {
    if (!userId) {
      setSummaries([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      setSummaries(await messageService.getConversations(userId))
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    void loadSummaries()
  }, [loadSummaries])

  const selectedId = conversationIdParam ? Number(conversationIdParam) : undefined

  const activeSummary = useMemo(
    () => summaries.find((summary) => summary.conversation.id === selectedId),
    [selectedId, summaries],
  )

  const handleSelect = (conversationId: number) => {
    navigate(`${ROUTES.messages}/${conversationId}`)
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 lg:h-[calc(100vh-9rem)] lg:flex-row">
      <aside
        className={cn(
          'card overflow-hidden p-0 lg:w-80 lg:shrink-0',
          selectedId ? 'hidden lg:block' : 'block',
        )}
      >
        <div className="border-b border-slate-100 px-4 py-3">
          <h1 className="text-base font-semibold text-slate-900">Messages</h1>
        </div>
        <div className="h-[60vh] lg:h-[calc(100%-3.25rem)]">
          <ConversationList
            summaries={summaries}
            activeConversationId={selectedId}
            isLoading={isLoading}
            onSelect={handleSelect}
          />
        </div>
      </aside>

      <section className={cn('card min-w-0 flex-1 overflow-hidden p-0', selectedId ? 'block' : 'hidden lg:block')}>
        {selectedId && activeSummary ? (
          <ChatWindow
            conversationId={selectedId}
            peerId={activeSummary.peerId}
            onSent={() => void loadSummaries()}
          />
        ) : selectedId ? (
          <div className="flex h-full min-h-[60vh] items-center justify-center">
            {isLoading ? (
              <Loader label="Opening conversation…" />
            ) : (
              <EmptyState
                title="Conversation unavailable"
                description="This conversation could not be found."
              />
            )}
          </div>
        ) : (
          <div className="hidden h-full items-center justify-center lg:flex">
            <EmptyState
              title="Select a conversation"
              description="Choose a chat from the list to start messaging."
            />
          </div>
        )}
      </section>
    </div>
  )
}
