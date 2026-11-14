import { EditButton } from '../settings/ProfileSettings'

export const Profile = () => {
  return (
    <section className="py-8 bg-elevated surface rounded-2xl border border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Sidebar */}
          <div>
            {/* Profile Image */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-6 md:mb-8">
              <img
                src="/assets/profile.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <button className="absolute bottom-3 right-3 rounded-full bg-primary p-2">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-8-8 8v7c0 6 8 10 8 10z"/>
                </svg>
              </button>
            </div>

            {/* Member since */}
            <div className="mb-6">
              <p className="text-token-text-caption">Member since 2024</p>
              <p className="font-medium text-token-text-primary">247 connections</p>
            </div>

            {/* Followers/Following */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-display text-xl font-bold">1,247</p>
                <p className="text-token-text-caption">Followers</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold">892</p>
                <p className="text-token-text-caption">Following</p>
              </div>
            </div>
          </div>

          {/* Profile Actions */}
          <EditButton />
        </div>

        {/* Main Profile Content */}
        <div className="space-y-6">
          {/* About Section */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">About Me</h2>
            <p className="text-token-text-secondary line-clamp-4">
              Software engineer who moved from Bangalore to Seattle in 2023. Love exploring new cuisines, hiking the Cascades, and staying connected with my roots through technology and community.
            </p>
          </div>

          {/* Hometown */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Hometown</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 rounded-2xl overflow-hidden bg-gradient-to-br from-terracotta to-copper">
                <div className="p-4">
                  <p className="font-medium text-token-text-caption">Bangalore, India</p>
                  <p className="text-token-text-muted text-xs">Karnataka</p>
                </div>
              </div>
              <svg className="w-6 h-6 text-token-text flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>

          {/* Languages */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Languages</h2>
            <div className="grid grid-cols-2 gap-2">
              <span className="px-3 py-1 rounded border bg-primary/10 text-primary">English</span>
              <span className="px-3 py-1 rounded border bg-primary/10 text-primary">Hindi</span>
              <span className="px-3 py-1 rounded border bg-primary/10 text-primary">Kannada</span>
            </div>
          </div>

          {/* Communities */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-4"> Communities</h2>
            <div className="grid grid-cols-2 gap-3">
              <span className="px-3 py-1 rounded border bg-surface-primary border border-border text-sm">Bangalore Tech Circle</span>
              <span className="px-3 py-1 rounded border bg-surface-primary border border-border text-sm">Mumbai Foodies</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}