import { lazy } from 'react'
import { Route, Navigate } from 'react-router-dom'

const Dashboard = lazy(() => import('../features/admin/dashboard').then((m) => ({ default: m.Dashboard })))
const Users = lazy(() => import('../features/admin/users').then((m) => ({ default: m.Users })))
const Communities = lazy(() => import('../features/admin/communities').then((m) => ({ default: m.Communities })))
const Posts = lazy(() => import('../features/admin/posts').then((m) => ({ default: m.Posts })))
const Moderation = lazy(() => import('../features/admin/moderation').then((m) => ({ default: m.Moderation })))
const Events = lazy(() => import('../features/admin/events').then((m) => ({ default: m.Events })))
const Reports = lazy(() => import('../features/admin/reports').then((m) => ({ default: m.Reports })))
const AdminNotifications = lazy(() => import('../features/admin/notifications').then((m) => ({ default: m.Notifications })))
const Languages = lazy(() => import('../features/admin/languages').then((m) => ({ default: m.Languages })))
const Locations = lazy(() => import('../features/admin/locations').then((m) => ({ default: m.Locations })))
const AdminConnections = lazy(() => import('../features/admin/connections').then((m) => ({ default: m.Connections })))
const AuditLogs = lazy(() => import('../features/admin/audit-logs').then((m) => ({ default: m.AuditLogs })))
const Analytics = lazy(() => import('../features/admin/analytics').then((m) => ({ default: m.Analytics })))
const AdminSettings = lazy(() => import('../features/admin/settings').then((m) => ({ default: m.Settings })))
const AdminProfile = lazy(() => import('../features/admin/profile').then((m) => ({ default: m.Profile })))
const Administrators = lazy(() => import('../features/admin/administrators').then((m) => ({ default: m.Administrators })))

export const AdminRoutes = (
  <>
    <Route index element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="users" element={<Users />} />
    <Route path="communities" element={<Communities />} />
    <Route path="posts" element={<Posts />} />
    <Route path="moderation" element={<Moderation />} />
    <Route path="events" element={<Events />} />
    <Route path="reports" element={<Reports />} />
    <Route path="notifications" element={<AdminNotifications />} />
    <Route path="languages" element={<Languages />} />
    <Route path="locations" element={<Locations />} />
    <Route path="connections" element={<AdminConnections />} />
    <Route path="audit-logs" element={<AuditLogs />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="settings" element={<AdminSettings />} />
    <Route path="profile" element={<AdminProfile />} />
    <Route path="administrators" element={<Administrators />} />
    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
  </>
)
