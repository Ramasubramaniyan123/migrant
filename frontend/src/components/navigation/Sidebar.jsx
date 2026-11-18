import { NavLink } from 'react-router-dom'
import {
  Home, Compass, Users, Newspaper, CalendarDays, User as UserIcon,
  Settings as SettingsIcon, MessageSquare,
} from 'lucide-react'

const ITEMS = [
  { to: '/app/home', label: 'Home', icon: Home },
  { to: '/app/discover', label: 'Discover', icon: Compass },
  { to: '/app/communities', label: 'Communities', icon: Users },
  { to: '/app/feed', label: 'Feed', icon: Newspaper },
  { to: '/app/connections', label: 'Connections', icon: UserIcon },
  { to: '/app/messages', label: 'Messages', icon: MessageSquare },
  { to: '/app/events', label: 'Events', icon: CalendarDays },
  { to: '/app/profile', label: 'Profile', icon: UserIcon },
  { to: '/app/settings', label: 'Settings', icon: SettingsIcon },
]

export const Sidebar = () => {
  return (
    <aside className="hidden w-60 flex-shrink-0 border-r border-line bg-surface lg:block">
      <nav className="sticky top-16 flex flex-col gap-1 p-4" aria-label="User navigation">
        {ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-hover hover:text-ink'
              }`
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
