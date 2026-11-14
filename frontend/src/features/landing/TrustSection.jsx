export const TrustSection = () => {
  return (
    <section className="py-24 md:py-32 bg-token-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid max-w-2xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Trusted by Migrants Worldwide
          </h2>
          <p className="font-body text-token-text-secondary">
            A safe, inclusive space designed to help you feel at home wherever you are.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="px-4 py-8 rounded-2xl bg-surface-primary border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-8-8 8v7c0 6 8 10 8 10z"/>
                <path d="M9 10v6m4 4v4m3-3H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/>
              </svg>
            </div>
            <h3 className="font-medium text-token-text-caption">Safe & Private</h3>
            <p className="text-token-text-muted text-sm">
              Your privacy is protected with industry-standard security.
            </p>
          </div>

          <div className="px-4 py-8 rounded-2xl bg-surface-primary border border-border">
            <div className="w-12 h-12 rounded-lg bg-information/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-information" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </div>
            <h3 className="font-medium text-token-text-caption">Verified Profiles</h3>
            <p className="text-token-text-muted text-sm">
              Authentic communities with real connections.
            </p>
          </div>

          <div className="px-4 py-8 rounded-2xl bg-surface-primary border border-border">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4m0 12v-4m-8-2h16m-8-8h16V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4m0 12h8m-4-4h8m-8 8V5"/>
              </svg>
            </div>
            <h3 className="font-medium text-token-text-caption">Community First</h3>
            <p className="text-token-text-muted text-sm">
              We're here to help you connect and belong.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}