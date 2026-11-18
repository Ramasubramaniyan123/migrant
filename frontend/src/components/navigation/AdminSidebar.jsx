import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, UsersRound, Newspaper, ShieldCheck, CalendarDays,
  Flag, Bell, Languages, MapPin, HeartHandshake, ScrollText, BarChart3,
  Settings as SettingsIcon, UserCog,
} from 'lucide-react'

const GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Management',
    items: [
      { to: '/admin/users', label: 'Users', icon: Users },
      { to: '/admin/communities', label: 'Communities', icon: UsersRound },
      { to: '/admin/posts', label: 'Posts', icon: Newspaper },
      { to: '/admin/events', label: 'Events', icon: CalendarDays },
      { to: '/admin/connections', label: 'Connections', icon: HeartHandshake },
    ],
  },
  {
    label: 'Trust & Safety',
    items: [
      { to: '/admin/moderation', label: 'Moderation', icon: ShieldCheck },
      { to: '/admin/reports', label: 'Reports', icon: Flag },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/notifications', label: 'Notifications', icon: Bell },
      { to: '/admin/languages', label: 'Languages', icon: Languages },
      { to: '/admin/locations', label: 'Locations', icon: MapPin },
      { to: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
      { to: '/admin/administrators', label: 'Administrators', icon: UserCog },
      { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
      { to: '/admin/profile', label: 'Profile', icon: UserCog },
    ],
  },
]

export const AdminSidebar = () => {
  return (
    <aside className="hidden w-60 flex-shrink-0 border-r border-line bg-surface lg:block">
      <nav className="sticky top-16 flex flex-col gap-4 overflow-y-auto p-4" aria-label="Admin navigation">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-ink-3">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-hover hover:text-ink'
                    }`
                  }
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
