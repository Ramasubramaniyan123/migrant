export const AdminCommunities = () => {
  return (
    <section className="py-8 bg-elevated surface rounded-2xl border border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <header className="flex flex-col items-start gap-4 mb-8">
          <h2 className="font-display text-3xl font-bold">Community Management</h2>
          <p className="font-body text-token-text-secondary">
            Manage communities and membership.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-surface-primary border border-border p-6">
            <h3 className="font-display text-xl font-bold mb-4">Community List</h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-token-text-caption">Bangalore Tech Circle</p>
                <p className="text-token-text-muted text-sm">247 members</p>
                <div className="mt-2 flex gap-2">
                  <button className="px-2 py-1 rounded border text-token-secondary text-sm">View</button>
                  <button className="px-2 py-1 rounded border bg-token-warning text-white text-sm">Moderate</button>
                </div>
              </div>
              <div>
                <p className="font-medium text-token-text-caption">Mumbai Foodies</p>
                <p className="text-token-text-muted text-sm">156 members</p>
                <div className="mt-2 flex gap-2">
                  <button className="px-2 py-1 rounded border text-token-secondary text-sm">View</button>
                  <button className="px-2 py-1 rounded border bg-token-warning text-white text-sm">Moderate</button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-surface-primary border border-border p-6">
            <h3 className="font-display text-xl font-bold mb-4">Create Community</h3>
            <form>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Community Name</label>
                  <input type="text" className="w-full rounded-lg border border-border px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea className="w-full rounded-lg border border-border px-4 py-3 min-h-[80px]"></textarea>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Hometown</label>
                  <input type="text" className="w-full rounded-lg border border-border px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select className="w-full rounded-lg border border-border px-4 py-3">
                    <option value="">Select language</option>
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-3 rounded-lg bg-primary text-white font-medium">
                Create Community
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}