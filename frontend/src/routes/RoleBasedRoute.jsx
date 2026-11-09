import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminAuthService from '../services/adminAuthService';
import Loading from '../components/common/Loading';

const RoleBasedRoute = ({ children, requiredRole }) => {
  const { isAdminAuthenticated, loading, admin } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check role if specified
  if (requiredRole && !adminAuthService.hasRole(requiredRole)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default RoleBasedRoute;
