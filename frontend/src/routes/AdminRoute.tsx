import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const AdminRoute: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.email !== 'admin@migrantcommunity.com') {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
};
