import { Routes, Route } from 'react-router-dom'
import { Dashboard } from '../features/admin/dashboard'
import { Users } from '../features/admin/users'
import { Communities } from '../features/admin/communities'
import { Posts } from '../features/admin/posts'
import { Moderation } from '../features/admin/moderation'
import { Events } from '../features/admin/events'
import { Reports } from '../features/admin/reports'
import { Notifications as AdminNotifications } from '../features/admin/notifications'
import { Languages } from '../features/admin/languages'
import { Locations } from '../features/admin/locations'
import { Connections as AdminConnections } from '../features/admin/connections'
import { AuditLogs } from '../features/admin/audit-logs'
import { Analytics } from '../features/admin/analytics'
import { Settings as AdminSettings } from '../features/admin/settings'
import { Profile as AdminProfile } from '../features/admin/profile'

export const AdminRoutes = () => (
  <Routes>
    <Route path="/admin/dashboard" element={<Dashboard />} />
    <Route path="/admin/users" element={<Users />} />
    <Route path="/admin/communities" element={<Communities />} />
    <Route path="/admin/posts" element={<Posts />} />
    <Route path="/admin/moderation" element={<Moderation />} />
    <Route path="/admin/events" element={<Events />} />
    <Route path="/admin/reports" element={<Reports />} />
    <Route path="/admin/notifications" element={<AdminNotifications />} />
    <Route path="/admin/languages" element={<Languages />} />
    <Route path="/admin/locations" element={<Locations />} />
    <Route path="/admin/connections" element={<AdminConnections />} />
    <Route path="/admin/audit-logs" element={<AuditLogs />} />
    <Route path="/admin/analytics" element={<Analytics />} />
    <Route path="/admin/settings" element={<AdminSettings />} />
    <Route path="/admin/profile" element={<AdminProfile />} />
  </Routes>
)