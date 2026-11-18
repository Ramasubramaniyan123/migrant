import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminTokenStore } from '../../../services/api/adminClient'
import { adminAuthService } from '../../../services/admin/adminService'
import { Avatar } from '../../../components/ui/Avatar'
import { AdminHeader, StatusBadge } from '../components/AdminUI'
import { formatDateTime } from '../../../utils/format'

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-ink-3">{label}</p>
    <p className="mt-1 text-sm font-medium">{value || '—'}</p>
  </div>
)

export const Profile = () => {
  const navigate = useNavigate()
  const session = adminTokenStore.get()
  const admin = session?.admin || {}
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState('')

  const logout = async () => {
    setLoggingOut(true)
    setError('')
    try {
      await adminAuthService.logout()
    } catch {
      // Ignore logout API errors — still clear the local session.
    } finally {
      adminTokenStore.clear()
      navigate('/login', { replace: true })
    }"}
  }

  return (
    <div>
      <AdminHeader
        title="Admin profile"
        description="Your administrator account details."
        actions={(
          <button type="button" className="btn-outline btn-sm text-danger" onClick={logout} disabled={loggingOut}>
            {loggingOut ? 'Signing out…' : 'Sign out'}
          </button>
        )}
      />

      {error && <p className="mb-4 rounded-lg bg-danger/10 px-4 py-2 text-sm text-danger">{error}</p>}

      <div className="card flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
        <Avatar name={admin.name || admin.email || 'Admin'} src={admin.avatarUrl} size="lg" />
        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          <Field label="Name" value={admin.name} />
          <Field label="Email" value={admin.email} />
          <Field label="Role" value={admin.role ? <StatusBadge status={admin.role} /> : null} />
          <Field label="Status" value={admin.status ? <StatusBadge status={admin.status} /> : null} />
          <Field label="Last login" value={admin.lastLoginAt ? formatDateTime(admin.lastLoginAt) : null} />
          <Field label="Created" value={admin.createdAt ? formatDateTime(admin.createdAt) : null} />
        </div>
      </div>
    </div>
  )
}
