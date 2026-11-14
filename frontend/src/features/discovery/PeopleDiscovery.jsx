export const PeopleDiscovery = () => {
  return (
    <section className="py-8 bg-elevated surface rounded-2xl border border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold">Discover People</h2>
            <p className="font-body text-token-text-secondary mt-1">
              Find people from your hometown, language, and interests.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-token-hover text-token-secondary hover:bg-token-hover transition-colors text-sm">
              All People
            </button>
            <button className="px-4 py-2 rounded-lg border border-token-hover text-token-secondary hover:bg-token-hover transition-colors text-sm">
              Nearby
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Person cards would go here */}
          <div className="rounded-2xl overflow-hidden bg-surface-primary border border-border hover:shadow-lg transition-shadow">
            <div className="p-4 flex flex-col flex-1">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-token-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21l-2-2-6-6l-2 2c-2 2-5.3 2-7.4 0l-2-2-6 6c-2 2-2 5 0 7l8 8 6-6z"/>
                  <circle cx="12" cy="12" r="4"/>
                </svg>
              </div>
              <h3 className="font-medium text-token-text-caption">Maria G.</h3>
              <p className="text-token-text-muted text-xs mt-1">
                Mumbai, India · Hindi · 2 weeks ago
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-surface-primary border border-border hover:shadow-lg transition-shadow">
            <div className="p-4 flex flex-col flex-1">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-terracotta to-copper flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-token-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21l-2-2-6-6l-2 2c-2 2-5.3 2-7.4 0l-2-2-6 6c-2 2-2 5 0 7l8 8 6-6z"/>
                  <circle cx="12" cy="12" r="4"/>
                </svg>
              </div>
              <h3 className="font-medium text-token-text-caption">Arjun S.</h3>
              <p className="text-token-text-muted text-xs mt-1">
                Bangalore, India · English · 1 month ago
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-surface-primary border border-border hover:shadow-lg transition-shadow">
            <div className="p-4 flex flex-col flex-1">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sage to-primary flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-token-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 7v6l4 2-4 2v-6c-2.76 0-5 2.24-5 5 0 .65.13 1.27.4 1.9l-3 8c-.18.48-.53.89-1 .95a4.98 4.98 0 0 1-.65.35c-2.31 0-4.17-1.95-4.17-4.36s1.86-4.36 4.17-4.36c.35 0 .68.02 1 .05v-3.5c0-1.23-.08-2.25-.3-3.15.83.4 1.58 1.06 1.96 1.88.38.83.68 1.67.92 2.28.75 2.21 1.79 4.33 3.06 5.16a11.958 11.958 0 0 1 2.2 1.75l.05.03a1 1 0 0 1-.07.26l-.2.85c-.08.38-.16.76-.22 1.13m8.16 1.75a8.967 8.967 0 0 1-2.4 1.75l-.05-.03c-.2-.54-.46-1.05-.66-1.53-.36-.79-.5-1.7-.5-2.75 0-1.86 1.52-3.35 3.37-3.93Z"/>
                  <path d="M12 2v2"/>
                </svg>
              </div>
              <h3 className="font-medium text-token-text-caption">Wei L.</h3>
              <p className="text-token-text-muted text-xs mt-1">
                Guangzhou, China · Mandarin · 2 months ago
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <a href="#"
             className="text-token-accent font-medium hover:underline">
            See All People
          </a>
        </div>
      </div>
    </section>
  )
}