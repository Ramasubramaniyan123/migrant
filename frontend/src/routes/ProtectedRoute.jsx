import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '@/components/common/Loader';
import { useAuth } from '@/hooks/useAuth';

/** Blocks unauthenticated visitors and remembers where they were heading. */
export default function ProtectedRoute() {
  const {
    isAuthenticated,
    isLoading
  } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return <Loader fullScreen label="Checking your session…" />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{
      from: location.pathname
    }} />;
  }
  return <Outlet />;
}
