export const Spinner = ({ className = 'w-5 h-5' }) => (
  <svg
    className={`animate-spin ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-90"
      fill="currentColor"
      d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
    />
  </svg>
)

export const LoadingState = ({ label = 'Loading…' }) => (
  <div className="flex items-center justify-center gap-3 py-16 text-ink-3" role="status">
    <Spinner className="w-6 h-6" />
    <span className="text-sm">{label}</span>
  </div>
)

export const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="rounded-xl border border-danger/30 bg-danger/5 p-6 text-center" role="alert">
    <p className="text-sm text-danger">{message}</p>
    {onRetry && (
      <button type="button" onClick={onRetry} className="btn-outline btn-sm mt-4">
        Try again
      </button>
    )}
  </div>
)

export const EmptyState = ({ title = 'Nothing here yet', description, action }) => (
  <div className="rounded-xl border border-dashed border-line bg-surface-alt/50 p-10 text-center">
    <p className="font-display text-lg font-semibold text-ink">{title}</p>
    {description && <p className="mt-1 text-sm text-ink-2">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
)
