import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminAuthProvider } from '@/context/AdminAuthContext'
import { AdminUserProvider } from '@/context/AdminUserContext'
import { ThemeProvider } from '@/context/ThemeContext'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedAdminRoute from './ProtectedAdminRoute'
import PermissionRoute from './PermissionRoute'
import { ADMIN_ROUTES } from '@/utils/constants'
import Loader from '@/components/common/Loader'
import { lazy, Suspense } from 'react'

// Auth pages (eager — first paint)
import AdminLoginPage from '@/pages/auth/AdminLoginPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'

// Lazy-load every admin module to keep the initial bundle small.
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const UsersPage = lazy(() => import('@/pages/users/UsersPage'))
const UserDetailsPage = lazy(() => import('@/pages/users/UserDetailsPage'))
const UserActivityPage = lazy(() => import('@/pages/users/UserActivityPage'))
const SuspendedUsersPage = lazy(() => import('@/pages/users/SuspendedUsersPage'))
const CommunitiesPage = lazy(() => import('@/pages/communities/CommunitiesPage'))
const CommunityDetailsPage = lazy(() => import('@/pages/communities/CommunityDetailsPage'))
const CreateCommunityPage = lazy(() => import('@/pages/communities/CreateCommunityPage'))
const EditCommunityPage = lazy(() => import('@/pages/communities/EditCommunityPage'))
const CommunityMembersPage = lazy(() => import('@/pages/communities/CommunityMembersPage'))
const LanguagesPage = lazy(() => import('@/pages/languages/LanguagesPage'))
const CreateLanguagePage = lazy(() => import('@/pages/languages/CreateLanguagePage'))
const EditLanguagePage = lazy(() => import('@/pages/languages/EditLanguagePage'))
const LocationsPage = lazy(() => import('@/pages/locations/LocationsPage'))
const CitiesPage = lazy(() => import('@/pages/locations/CitiesPage'))
const LocalitiesPage = lazy(() => import('@/pages/locations/LocalitiesPage'))
const ModerationDashboard = lazy(() => import('@/pages/moderation/ModerationDashboard'))
const ReportsPage = lazy(() => import('@/pages/moderation/ReportsPage'))
const ReportDetailsPage = lazy(() => import('@/pages/moderation/ReportDetailsPage'))
const PostModerationPage = lazy(() => import('@/pages/moderation/PostModerationPage'))
const UserModerationPage = lazy(() => import('@/pages/moderation/UserModerationPage'))
const BlockedContentPage = lazy(() => import('@/pages/moderation/BlockedContentPage'))
const ModerationHistoryPage = lazy(() => import('@/pages/moderation/ModerationHistoryPage'))
const PostsPage = lazy(() => import('@/pages/posts/PostsPage'))
const PostDetailsPage = lazy(() => import('@/pages/posts/PostDetailsPage'))
const FlaggedPostsPage = lazy(() => import('@/pages/posts/FlaggedPostsPage'))
const ConnectionsPage = lazy(() => import('@/pages/connections/ConnectionsPage'))
const ConnectionAnalytics = lazy(() => import('@/pages/connections/ConnectionAnalytics'))
const EventsPage = lazy(() => import('@/pages/events/EventsPage'))
const CreateEventPage = lazy(() => import('@/pages/events/CreateEventPage'))
const EditEventPage = lazy(() => import('@/pages/events/EditEventPage'))
const EventParticipantsPage = lazy(() => import('@/pages/events/EventParticipantsPage'))
const AnalyticsPage = lazy(() => import('@/pages/analytics/AnalyticsPage'))
const UserGrowthPage = lazy(() => import('@/pages/analytics/UserGrowthPage'))
const EngagementPage = lazy(() => import('@/pages/analytics/EngagementPage'))
const LanguageDistributionPage = lazy(() => import('@/pages/analytics/LanguageDistributionPage'))
const GeographicDistributionPage = lazy(() => import('@/pages/analytics/GeographicDistributionPage'))
const RetentionPage = lazy(() => import('@/pages/analytics/RetentionPage'))
const AdministratorsPage = lazy(() => import('@/pages/administrators/AdministratorsPage'))
const CreateAdminPage = lazy(() => import('@/pages/administrators/CreateAdminPage'))
const AdminDetailsPage = lazy(() => import('@/pages/administrators/AdminDetailsPage'))
const RolesPermissionsPage = lazy(() => import('@/pages/administrators/RolesPermissionsPage'))
const AuditLogsPage = lazy(() => import('@/pages/audit/AuditLogsPage'))
const AdminActivityPage = lazy(() => import('@/pages/audit/AdminActivityPage'))
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'))
const SendNotificationPage = lazy(() => import('@/pages/notifications/SendNotificationPage'))
const NotificationHistoryPage = lazy(() => import('@/pages/notifications/NotificationHistoryPage'))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))
const GeneralSettingsPage = lazy(() => import('@/pages/settings/GeneralSettingsPage'))
const PlatformSettingsPage = lazy(() => import('@/pages/settings/PlatformSettingsPage'))
const SecuritySettingsPage = lazy(() => import('@/pages/settings/SecuritySettingsPage'))
const MaintenancePage = lazy(() => import('@/pages/settings/MaintenancePage'))

function PageLoader() {
  return <Loader label="Loading module…" className="min-h-[50vh]" />
}

export default function AdminRoutes() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AdminAuthProvider>
          <AdminUserProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public auth routes */}
                <Route path={ADMIN_ROUTES.login} element={<AdminLoginPage />} />
                <Route path={ADMIN_ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
                <Route path={ADMIN_ROUTES.resetPassword} element={<ResetPasswordPage />} />

                {/* Protected admin area */}
                <Route element={<ProtectedAdminRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/" element={<Navigate to={ADMIN_ROUTES.dashboard} replace />} />

                    <Route path={ADMIN_ROUTES.dashboard} element={<DashboardPage />} />

                    {/* Users */}
                    <Route path={ADMIN_ROUTES.users} element={<UsersPage />} />
                    <Route path={ADMIN_ROUTES.userDetails(':id')} element={<UserDetailsPage />} />
                    <Route path={ADMIN_ROUTES.userActivity(':id')} element={<UserActivityPage />} />
                    <Route path={ADMIN_ROUTES.suspendedUsers} element={<SuspendedUsersPage />} />

                    {/* Communities */}
                    <Route path={ADMIN_ROUTES.communities} element={<CommunitiesPage />} />
                    <Route path={ADMIN_ROUTES.communityDetails(':id')} element={<CommunityDetailsPage />} />
                    <Route path={ADMIN_ROUTES.createCommunity} element={<CreateCommunityPage />} />
                    <Route path={ADMIN_ROUTES.editCommunity(':id')} element={<EditCommunityPage />} />
                    <Route path={ADMIN_ROUTES.communityMembers(':id')} element={<CommunityMembersPage />} />

                    {/* Languages */}
                    <Route path={ADMIN_ROUTES.languages} element={<LanguagesPage />} />
                    <Route path={ADMIN_ROUTES.createLanguage} element={<CreateLanguagePage />} />
                    <Route path={ADMIN_ROUTES.editLanguage(':id')} element={<EditLanguagePage />} />

                    {/* Locations */}
                    <Route path={ADMIN_ROUTES.locations} element={<LocationsPage />} />
                    <Route path={ADMIN_ROUTES.cities} element={<CitiesPage />} />
                    <Route path={ADMIN_ROUTES.localities} element={<LocalitiesPage />} />

                    {/* Moderation */}
                    <Route path={ADMIN_ROUTES.moderation} element={<ModerationDashboard />} />
                    <Route path={ADMIN_ROUTES.reports} element={<ReportsPage />} />
                    <Route path={ADMIN_ROUTES.reportDetails(':id')} element={<ReportDetailsPage />} />
                    <Route path={ADMIN_ROUTES.postModeration} element={<PostModerationPage />} />
                    <Route path={ADMIN_ROUTES.userModeration} element={<UserModerationPage />} />
                    <Route path={ADMIN_ROUTES.blockedContent} element={<BlockedContentPage />} />
                    <Route path={ADMIN_ROUTES.moderationHistory} element={<ModerationHistoryPage />} />

                    {/* Posts */}
                    <Route path={ADMIN_ROUTES.posts} element={<PostsPage />} />
                    <Route path={ADMIN_ROUTES.postDetails(':id')} element={<PostDetailsPage />} />
                    <Route path={ADMIN_ROUTES.flaggedPosts} element={<FlaggedPostsPage />} />

                    {/* Connections */}
                    <Route path={ADMIN_ROUTES.connections} element={<ConnectionsPage />} />
                    <Route path={ADMIN_ROUTES.connectionAnalytics} element={<ConnectionAnalytics />} />

                    {/* Events */}
                    <Route path={ADMIN_ROUTES.events} element={<EventsPage />} />
                    <Route path={ADMIN_ROUTES.createEvent} element={<CreateEventPage />} />
                    <Route path={ADMIN_ROUTES.editEvent(':id')} element={<EditEventPage />} />
                    <Route path={ADMIN_ROUTES.eventParticipants(':id')} element={<EventParticipantsPage />} />

                    {/* Analytics */}
                    <Route path={ADMIN_ROUTES.analytics} element={<AnalyticsPage />} />
                    <Route path={ADMIN_ROUTES.userGrowth} element={<UserGrowthPage />} />
                    <Route path={ADMIN_ROUTES.engagement} element={<EngagementPage />} />
                    <Route path={ADMIN_ROUTES.languageDistribution} element={<LanguageDistributionPage />} />
                    <Route path={ADMIN_ROUTES.geographicDistribution} element={<GeographicDistributionPage />} />
                    <Route path={ADMIN_ROUTES.retention} element={<RetentionPage />} />

                    {/* Administrators */}
                    <Route path={ADMIN_ROUTES.administrators} element={<AdministratorsPage />} />
                    <Route path={ADMIN_ROUTES.createAdmin} element={<CreateAdminPage />} />
                    <Route path={ADMIN_ROUTES.adminDetails(':id')} element={<AdminDetailsPage />} />
                    <Route path={ADMIN_ROUTES.rolesPermissions} element={<RolesPermissionsPage />} />

                    {/* Audit */}
                    <Route path={ADMIN_ROUTES.auditLogs} element={<AuditLogsPage />} />
                    <Route path={ADMIN_ROUTES.adminActivity} element={<AdminActivityPage />} />

                    {/* Notifications */}
                    <Route path={ADMIN_ROUTES.notifications} element={<NotificationsPage />} />
                    <Route path={ADMIN_ROUTES.sendNotification} element={<SendNotificationPage />} />
                    <Route path={ADMIN_ROUTES.notificationHistory} element={<NotificationHistoryPage />} />

                    {/* Settings */}
                    <Route path={ADMIN_ROUTES.settings} element={<SettingsPage />} />
                    <Route path={ADMIN_ROUTES.platformSettings} element={<PlatformSettingsPage />} />
                    <Route path={ADMIN_ROUTES.securitySettings} element={<SecuritySettingsPage />} />
                    <Route path={ADMIN_ROUTES.maintenance} element={<MaintenancePage />} />

                    <Route path="*" element={<Navigate to={ADMIN_ROUTES.dashboard} replace />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </AdminUserProvider>
        </AdminAuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
