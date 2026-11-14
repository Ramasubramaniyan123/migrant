export const DiscoverPeople = () => {
  return (
    <div className="group hover:shadow-lg transition-shadow">
      <div className="rounded-2xl overflow-hidden bg-surface-primary p-6 hover:bg-primary transition-colors">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-token-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21l-2-2-6-6l-2 2c-2 2-5.3 2-7.4 0l-2-2-6 6c-2 2-2 5 0 7l8 8 6-6z"/>
              <circle cx="12" cy="12" r="4"/>
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-token-text-caption">Discover People</h3>
            <p className="text-token-text-muted text-sm line-clamp-2">
              Find people from your hometown, language, and interests.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}