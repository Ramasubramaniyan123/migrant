import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '@/store/AppProvider'

export function RequireAuth() {
  const { currentUser } = useApp()
  const location = useLocation()
  if (!currentUser) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!currentUser.onboardingComplete) return <Navigate to="/onboarding" replace />
  return <Outlet />
}

export function RequireGuest() {
  const { currentUser } = useApp()
  if (currentUser?.onboardingComplete) return <Navigate to="/app" replace />
  if (currentUser && !currentUser.onboardingComplete) return <Navigate to="/onboarding" replace />
  return <Outlet />
}

export function RequireOnboarding() {
  const { currentUser } = useApp()
  if (!currentUser) return <Navigate to="/login" replace />
  if (currentUser.onboardingComplete) return <Navigate to="/app" replace />
  return <Outlet />
}

export function RequireAdmin() {
  const { currentUser } = useApp()
  if (!currentUser || currentUser.role !== 'admin') return <Navigate to="/app" replace />
  return <Outlet />
}
