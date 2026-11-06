import { Link } from 'react-router-dom'
import { UserPlus, Building2, Flag, Send } from 'lucide-react'
import { ADMIN_ROUTES } from '@/utils/constants'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { hasPermission } from '@/utils/permissions'
import type { Permission } from '@/utils/permissions'

interface QuickAction {
  label: string
  description: string
  to: string
  icon: typeof UserPlus
  permission: Permission
}

const ACTIONS: QuickAction[] = [
  { label: 'Add administrator', description: 'Invite a new admin', to: ADMIN_ROUTES.createAdmin, icon: UserPlus, permission: 'admins:manage' },
  { label: 'Create community', description: 'Set up a new group', to: ADMIN_ROUTES.createCommunity, icon: Building2, permission: 'communities:manage' },
  { label: 'Review reports', description: 'Open moderation queue', to: ADMIN_ROUTES.reports, icon: Flag, permission: 'moderation:view' },
  { label: 'Send announcement', description: 'Broadcast to users', to: ADMIN_ROUTES.sendNotification, icon: Send, permission: 'notifications:send' },
]

export default function QuickActions() {
  const { admin } = useAdminAuth()
  const visible = ACTIONS.filter((a) => hasPermission(admin?.role, a.permission))
  if (visible.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3">
      {visible.map((a) => (
        <Link
          key={a.to}
          to={a.to}
          className="card group flex items-center gap-3 p-4 transition-shadow hover:shadow-md"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/50 dark:text-blue-400">
            <a.icon className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">{a.label}</span>
            <span className="block text-xs text-slate-500">{a.description}</span>
          </span>
        </Link>
      ))}
    </div>
  )
}
