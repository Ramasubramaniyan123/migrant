import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '@/components/layout/AuthLayout';
import MainLayout from '@/components/layout/MainLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import CommunityManagement from '@/pages/admin/CommunityManagement';
import ReportManagement from '@/pages/admin/ReportManagement';
import UserManagement from '@/pages/admin/UserManagement';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import CommunityDetailsPage from '@/pages/communities/CommunityDetailsPage';
import CommunitiesPage from '@/pages/communities/CommunitiesPage';
import ConnectionsPage from '@/pages/connections/ConnectionsPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import DiscoverPage from '@/pages/discover/DiscoverPage';
import HometownMatchPage from '@/pages/hometown/HometownMatchPage';
import LandingPage from '@/pages/landing/LandingPage';
import MessagesPage from '@/pages/messages/MessagesPage';
import NotificationsPage from '@/pages/notifications/NotificationsPage';
import OnboardingPage from '@/pages/onboarding/OnboardingPage';
import EditProfilePage from '@/pages/profile/EditProfilePage';
import ProfilePage from '@/pages/profile/ProfilePage';
import UserProfilePage from '@/pages/profile/UserProfilePage';
import SettingsPage from '@/pages/settings/SettingsPage';
import AdminRoute from './AdminRoute';
import ProtectedRoute from './ProtectedRoute';
export default function AppRoutes() {
  return <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/hometown" element={<HometownMatchPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/communities/:communityId" element={<CommunityDetailsPage />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:conversationId" element={<MessagesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/reports" element={<ReportManagement />} />
            <Route path="/admin/communities" element={<CommunityManagement />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>;
}
