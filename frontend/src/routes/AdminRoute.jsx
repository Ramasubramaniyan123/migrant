import { Navigate, Outlet } from 'react-router-dom';
import Loader from '@/components/common/Loader';
import { useAuth } from '@/hooks/useAuth';

/** Restricts the admin area to users with the ADMIN role. */
export default function AdminRoute() {
  const {
    isAdmin,
    isLoading
  } = useAuth();
  if (isLoading) {
    return <Loader fullScreen label="Verifying permissions…" />;
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
