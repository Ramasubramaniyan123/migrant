export const EditButton = () => {
  return (
    <button
      className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-opacity mb-4"
    >
      Edit Profile
    </button>
  )
}

export const PrivacySettings = () => {
  return (
    <section className="py-8 bg-elevated surface rounded-2xl border border-border">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        <h2 className="font-display text-2xl font-bold mb-6">Privacy Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="rounded w-5 h-5 cursor-pointer"
                checked
              />
              <div>
                <p className="font-medium text-token-text-caption">Who can see your profile</p>
                <p className="text-token-text-muted text-xs ml-2">Everyone</p>
              </div>
            </label>
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="rounded w-5 h-5 cursor-pointer"
                checked
              />
              <div>
                <p className="font-medium text-token-text-caption">Allow friend requests</p>
                <p className="text-token-text-muted text-xs ml-2">From people from your hometown</p>
              </div>
            </label>
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="rounded w-5 h-5 cursor-pointer"
                checked
              />
              <div>
                <p className="font-medium text-token-text-caption">Show when you're online</p>
                <p className="text-token-text-muted text-xs ml-2">Friends only</p>
              </div>
            </label>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex justify-end">
          <button className="px-6 py-3 rounded-lg bg-token-secondary text-token-primary hover:bg-token-hover transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </section>
  )
}