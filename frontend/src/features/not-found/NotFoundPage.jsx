import { Link } from 'react-router-dom'

export const NotFoundPage = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
    <p className="font-display text-6xl font-bold text-accent">404</p>
    <h1 className="mt-4 font-display text-2xl font-bold text-ink">Page not found</h1>
    <p className="mt-2 max-w-md text-sm text-ink-2">
      The page you're looking for doesn't exist or may have been moved.
    </p>
    <div className="mt-6 flex gap-3">
      <Link to="/" className="btn-primary">Go home</Link>
      <Link to="/app/home" className="btn-outline">Dashboard</Link>
    </div>
  </div>
)
