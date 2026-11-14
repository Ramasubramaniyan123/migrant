export const AdminEvents = () => {
  return (
    <section className="py-8 bg-elevated surface rounded-2xl border border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <header className="flex flex-col items-start gap-4 mb-8">
          <h2 className="font-display text-3xl font-bold">Event Management</h2>
          <p className="font-body text-token-text-secondary">
            Manage community events.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-surface-primary border border-border p-6">
            <h3 className="font-display text-xl font-bold mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-token-text-caption">Diwali Celebration</p>
                <p className="text-token-text-muted text-xs">Nov 1, 2024</p>
                <p className="text-token-text-caption">78 / 50 registered</p>
                <button className="px-2 py-1 rounded border text-token-secondary text-sm">Edit</button>
                <button className="px-2 py-1 rounded border bg-token-error text-white text-sm">Cancel</button>
              </div>
              <div>
                <p className="font-medium text-token-text-caption">Tech Networking Mixer</p>
                <p className="text-token-text-muted text-xs">Nov 8, 2024</p>
                <p className="text-token-text-caption">78 / 100 registered</p>
                <button className="px-2 py-1 rounded border text-token-secondary text-sm">Edit</button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-surface-primary border border-border p-6">
            <h3 className="font-display text-xl font-bold mb-4">Create Event</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Event Title</label>
                <input type="text" className="w-full rounded-lg border border-border px-4 py-3" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea className="w-full rounded-lg border border-border px-4 py-3 min-h-[80px]"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Community</label>
                  <select className="w-full rounded-lg border border-border px-4 py-3">
                    <option value="">Select community</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date & Time</label>
                  <input type="datetime-local" className="w-full rounded-lg border border-border px-4 py-3" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input type="text" className="w-full rounded-lg border border-border px-4 py-3" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Participants</label>
                <input type="number" className="w-full rounded-lg border border-border px-4 py-3" />
              </div>
              <button type="submit" className="w-full py-3 rounded-lg bg-primary text-white font-medium">
                Create Event
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}