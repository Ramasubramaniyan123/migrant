export const Conversation = () => {
  return (
    <div className="space-y-3 pt-3">
      <h3 className="font-display text-lg font-bold">New Conversation</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button className="px-4 py-2 rounded-lg border border-token-hover text-token-secondary hover:bg-token-hover transition-colors text-sm">
          Maria G.
        </button>
        <button className="px-4 py-2 rounded-lg border border-token-hover text-token-secondary hover:bg-token-hover transition-colors text-sm">
          Arjun S.
        </button>
      </div>

      {/* Recent messages */}
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-dark-dark border border-border p-6">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-terracotta to-copper flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-token-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21l-2-2-6-6l-2 2c-2 2-5.3 2-7.4 0l-2-2-6 6c-2 2-2 5 0 7l8 8 6-6z"/>
              <circle cx="12" cy="12" r="4"/>
            </svg>
          </div>
          <div>
            <p className="font-body">Hi! It's great to connect with you.</p>
            <p className="text-token-text-muted text-xs">Maria G. · 2m ago</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex gap-2">
            <textarea
              className="flex-1 rounded-lg border border-border px-4 py-2 text-token-text resize-none min-h-[40px]"
              placeholder="Type a message..."
            ></textarea>
            <button className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-opacity">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}