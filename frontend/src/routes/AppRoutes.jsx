import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import UserLayout from '../components/layout/UserLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Route guards
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';

// Public Pages
import LandingPage from '../pages/landing/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';

// User Pages
import UserDashboard from '../pages/dashboard/UserDashboard';
import DiscoverPage from '../pages/discover/DiscoverPage';
import CommunitiesPage from '../pages/communities/CommunitiesPage';
import CommunityDetailsPage from '../pages/communities/CommunityDetailsPage';
import ConnectionsPage from '../pages/connections/ConnectionsPage';
import MessagesPage from '../pages/messages/MessagesPage';
import EventsPage from '../pages/events/EventsPage';
import EventDetailsPage from '../pages/events/EventDetailsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import OnboardingPage from '../pages/onboarding/OnboardingPage';

// Admin Pages
import AdminLoginPage from '../pages/admin/auth/AdminLoginPage';
import AdminDashboard from '../pages/admin/dashboard/AdminDashboard';
import AdminUsers from '../pages/admin/users/AdminUsers';
import AdminUserDetails from '../pages/admin/users/AdminUserDetails';
import AdminCommunities from '../pages/admin/communities/AdminCommunities';
import AdminModeration from '../pages/admin/moderation/AdminModeration';
import AdminPosts from '../pages/admin/posts/AdminPosts';
import AdminEvents from '../pages/admin/events/AdminEvents';
import AdminConnections from '../pages/admin/connections/AdminConnections';
import AdminAnalytics from '../pages/admin/analytics/AdminAnalytics';
import AdminLanguages from '../pages/admin/languages/AdminLanguages';
import AdminLocations from '../pages/admin/locations/AdminLocations';
import AdminNotifications from '../pages/admin/notifications/AdminNotifications';
import AdminAdministrators from '../pages/admin/administrators/AdminAdministrators';
import AdminAudit from '../pages/admin/audit/AdminAudit';
import AdminSettings from '../pages/admin/settings/AdminSettings';

const AppRoutes = () => {
  const { isAuthenticated, isAdminAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Navigate to="/app/dashboard" replace /> : 
              isAdminAuthenticated ? <Navigate to="/admin/dashboard" replace /> :
              <LandingPage />
            } 
          />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <RegisterPage />} 
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Route>

        {/* Onboarding (Protected but outside main layout) */}
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          } 
        />

        {/* User Routes */}
        <Route 
          path="/app" 
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="communities" element={<CommunitiesPage />} />
          <Route path="communities/:id" element={<CommunityDetailsPage />} />
          <Route path="connections" element={<ConnectionsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Admin Login */}
        <Route 
          path="/admin/login" 
          element={isAdminAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminLoginPage />} 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <RoleBasedRoute>
              <AdminLayout />
            </RoleBasedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetails />} />
          <Route path="communities" element={<AdminCommunities />} />
          <Route path="moderation" element={<AdminModeration />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="connections" element={<AdminConnections />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="languages" element={<AdminLanguages />} />
          <Route path="locations" element={<AdminLocations />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route 
            path="administrators" 
            element={
              <RoleBasedRoute requiredRole="SUPER_ADMIN">
                <AdminAdministrators />
              </RoleBasedRoute>
            } 
          />
          <Route path="audit" element={<AdminAudit />} />
          <Route 
            path="settings" 
            element={
              <RoleBasedRoute requiredRole="ADMIN">
                <AdminSettings />
              </RoleBasedRoute>
            } 
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
