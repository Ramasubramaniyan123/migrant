import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import Loader from '@/components/common/Loader'
import { ADMIN_ROUTES } from '@/utils/constants'

/** Redirects unauthenticated admins to the login page, preserving the target URL. */
export default function ProtectedAdminRoute() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const location = useLocation()

  if (isLoading) return <Loader label="Checking session…" className="h-screen" />
  if (!isAuthenticated) {
    return <Navigate to={ADMIN_ROUTES.login} replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
