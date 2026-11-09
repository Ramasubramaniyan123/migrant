import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '@/components/common/Loader';
import { useAuth } from '@/hooks/useAuth';

/** Blocks unauthenticated visitors and remembers where they were heading. */
export default function ProtectedRoute() {
  const {
    isAuthenticated,
    isLoading,
    verificationRequired
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
  // The backend rejects every API call for unverified accounts — send the
  // user to the verification screen instead of letting pages fail with 401s.
  if (verificationRequired) {
    return <Navigate to="/verify-email" replace />;
  }
  return <Outlet />;
}
