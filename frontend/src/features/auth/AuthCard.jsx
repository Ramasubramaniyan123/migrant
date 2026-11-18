export const AuthCard = ({ title, subtitle, children, footer }) => (
  <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
    <div className="w-full max-w-md">
      <div className="card p-8">
        <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-2">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <div className="mt-4 text-center text-sm text-ink-2">{footer}</div>}
    </div>
  </div>
)

export const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-xs text-danger" role="alert">{message}</p> : null

export const FormError = ({ message }) =>
  message ? (
    <div className="mb-4 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">
      {message}
    </div>
  ) : null

export const FormSuccess = ({ message }) =>
  message ? (
    <div className="mb-4 rounded-lg border border-success/30 bg-success/5 px-4 py-3 text-sm text-success" role="status">
      {message}
    </div>
  ) : null
