import { useState } from 'react'
import { useConnections } from '@/hooks/useConnections'
import MyConnections from './MyConnections'
import ReceivedRequests from './ReceivedRequests'
import SentRequests from './SentRequests'

type TabKey = 'received' | 'sent' | 'accepted'

/** Connections hub with tabs for received, sent and accepted connections. */
export default function ConnectionsPage() {
  const { receivedRequests, sentRequests, accepted } = useConnections()
  const [tab, setTab] = useState<TabKey>('received')

  const tabs: Array<{ key: TabKey; label: string; count: number }> = [
    { key: 'received', label: 'Received', count: receivedRequests.length },
    { key: 'sent', label: 'Sent', count: sentRequests.length },
    { key: 'accepted', label: 'My connections', count: accepted.length },
  ]

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="page-title">Connections</h1>
        <p className="muted mt-1">
          {receivedRequests.length} incoming · {sentRequests.length} outgoing · {accepted.length} connected
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={
              'flex items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition ' +
              (tab === item.key ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100')
            }
          >
            {item.label}
            <span
              className={
                'rounded-full px-2 py-0.5 text-xs ' +
                (tab === item.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600')
              }
            >
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {tab === 'received' && <ReceivedRequests />}
      {tab === 'sent' && <SentRequests />}
      {tab === 'accepted' && <MyConnections />}
    </div>
  )
}
