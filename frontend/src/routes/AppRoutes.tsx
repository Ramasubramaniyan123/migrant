import React from 'react';
import { Route } from 'react-router-dom';
import { AdminRoute } from './AdminRoute';
import { ROUTES } from '@/utils/constants';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';

export const AppRoutes: React.FC = () => {
  return (
    <>
      <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
      <Route path={ROUTES.DISCOVER} element={<div>Discover Page</div>} />
      <Route path={ROUTES.HOMETOWN} element={<div>Hometown Match Page</div>} />
      <Route path={ROUTES.COMMUNITIES} element={<div>Communities Page</div>} />
      <Route path={ROUTES.COMMUNITY_DETAILS} element={<div>Community Details Page</div>} />
      <Route path={ROUTES.CONNECTIONS} element={<div>Connections Page</div>} />
      <Route path={ROUTES.MESSAGES} element={<div>Messages Page</div>} />
      <Route path={ROUTES.CONVERSATION} element={<div>Conversation Page</div>} />
      <Route path={ROUTES.PROFILE} element={<div>Profile Page</div>} />
      <Route path={ROUTES.USER_PROFILE} element={<div>User Profile Page</div>} />
      <Route path={ROUTES.NOTIFICATIONS} element={<div>Notifications Page</div>} />
      <Route path={ROUTES.SETTINGS} element={<div>Settings Page</div>} />
      <Route element={<AdminRoute />}>
        <Route path={ROUTES.ADMIN} element={<div>Admin Page</div>} />
      </Route>
    </>
  );
};
