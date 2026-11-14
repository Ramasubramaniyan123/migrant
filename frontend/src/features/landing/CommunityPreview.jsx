export const CommunityHub = () => {
  return (
    <div className="group hover:shadow-lg transition-shadow">
      <div className="rounded-2xl overflow-hidden bg-surface-primary p-6 hover:bg-primary transition-colors">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-deepNavy to-midnight flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-token-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="2"/>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="10 8 12 8 14 12 16 12"/>
              <line x1="9" y1="13" x2="15" y2="13"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-token-text-caption">Community Hub</h3>
            <p className="text-token-text-muted text-sm line-clamp-2">
              Join communities based on shared interests and regional identity.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}