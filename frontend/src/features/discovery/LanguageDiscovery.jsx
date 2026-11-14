export const LanguageDiscovery = () => {
  return (
    <section className="py-8 bg-elevated surface rounded-2xl border border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <header className="flex flex-col items-start gap-4 mb-8">
          <h2 className="font-display text-3xl font-bold">Language Discovery</h2>
          <p className="font-body text-token-text-secondary">
            Connect through shared languages and cultural affinity.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl overflow-hidden bg-surface-primary border border-border group-hover:shadow-lg transition-shadow">
            <div className="p-4 flex flex-col flex-1">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-information to-primary flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-token-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              </div>
              <h3 className="font-medium text-token-text-caption">English speakers</h3>
              <p className="text-token-text-muted text-sm mt-1">
                47 members
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-surface-primary border border-border group-hover:shadow-lg transition-shadow">
            <div className="p-4 flex flex-col flex-1">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success to-primary flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-token-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4m0 12v-4m-8-2h16m-8-8h16V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4m0 12h8m-4-4h8m-8 8V5"/>
                  <svg className="w-5 h-5 text-token-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4m0 12v-4m-8-2h16m-8-8h16V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4m0 12h8m-4-4h8"/>
                  </svg>
                </svg>
              </div>
              <h3 className="font-medium text-token-text-caption">Spanish speakers</h3>
              <p className="text-token-text-muted text-sm mt-1">
                32 members
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-surface-primary border border-border group-hover:shadow-lg transition-shadow">
            <div className="p-4 flex flex-col flex-1">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning to-primary flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-token-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4m0 12v-4m-8-2h16m-8-8h16V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4m0 12h8m-4-4h8m-8 8V5"/>
                  <svg className="w-5 h-5 text-token-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4m0 12v-4m-8-2h16m-8-8h16V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4m0 12h8m-4-4h8"/>
                  </svg>
                </svg>
              </div>
              <h3 className="font-medium text-token-text-caption">French speakers</h3>
              <p className="text-token-text-muted text-sm mt-1">
                15 members
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <a href="#" className="text-token-accent font-medium hover:underline">
            Explore All Languages
          </a>
        </div>
      </div>
    </section>
  )
}