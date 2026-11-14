import { PrivacySettings } from './ProfileSettings'

export const Settings = () => {
  return (
    <section className="py-8 bg-elevated surface rounded-2xl border border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PrivacySettings />

          <div>
            <h2 className="font-display text-xl font-bold mb-4">Account</h2>
            <div className="space-y-3">
              <button className="w-full py-3 rounded-lg border border-border text-left px-4 hover:bg-hover transition-colors">
                Change Password
              </button>
              <button className="w-full py-3 rounded-lg border border-border text-left px-4 hover:bg-hover transition-colors">
                Deactivate Account
              </button>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold mb-4">Notification Preferences</h2>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked className="rounded w-4 h-4 cursor-pointer" />
                <span>Connection requests</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked className="rounded w-4 h-4 cursor-pointer" />
                <span>Messages</span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3 my-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked className="rounded w-4 h-4 cursor-pointer" />
                <span>Comments</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked className="rounded w-4 h-4 cursor-pointer" />
                <span>Reactions</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}