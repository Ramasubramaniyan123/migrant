import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts'
import { LoadingState } from '../components/ui/States'

export const PrivateRoute = () => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <LoadingState label="Restoring your session…" />
      </div>
    )
  }

  if (!user) {
    const from = location.pathname + location.search
    return <Navigate to="/login" state={{ from }} replace />
  }

  return <Outlet />
}
