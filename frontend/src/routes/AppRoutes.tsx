import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { ROUTES } from '@/utils/constants';

import { LandingPage } from '@/pages/landing/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';

import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { DiscoverPage } from '@/pages/discover/DiscoverPage';
import { HometownMatchPage } from '@/pages/hometown/HometownMatchPage';
import { CommunitiesPage } from '@/pages/communities/CommunitiesPage';
import { CommunityDetailsPage } from '@/pages/communities/CommunityDetailsPage';
import { ConnectionsPage } from '@/pages/connections/ConnectionsPage';
import { MessagesPage } from '@/pages/messages/MessagesPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { EditProfilePage } from '@/pages/profile/EditProfilePage';
import { UserProfilePage } from '@/pages/profile/UserProfilePage';
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

      {/* Onboarding */}
      <Route path={ROUTES.ONBOARDING} element={<OnboardingPage />} />

      {/* Protected App Pages inside MainLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/app" element={<DashboardPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/app/discover" element={<DiscoverPage />} />
          <Route path="/hometown" element={<HometownMatchPage />} />
          <Route path="/app/hometown" element={<HometownMatchPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/app/communities" element={<CommunitiesPage />} />
          <Route path="/communities/:id" element={<CommunityDetailsPage />} />
          <Route path="/app/communities/:id" element={<CommunityDetailsPage />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="/app/connections" element={<ConnectionsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/app/messages" element={<MessagesPage />} />
          <Route path="/messages/:id" element={<MessagesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/app/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/profile/:id" element={<UserProfilePage />} />
          <Route path="/app/people/:id" element={<UserProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/app/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/app/settings" element={<SettingsPage />} />

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/app/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
