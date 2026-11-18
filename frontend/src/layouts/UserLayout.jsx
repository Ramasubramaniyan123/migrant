import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts'
import { NavBar } from '../components/navigation/NavBar'
import { Sidebar } from '../components/navigation/Sidebar'

const MOBILE_LINKS = [
  { to: '/app/home', label: 'Home' },
  { to: '/app/discover', label: 'Discover' },
  { to: '/app/communities', label: 'Communities' },
  { to: '/app/feed', label: 'Feed' },
  { to: '/app/connections', label: 'Connections' },
  { to: '/app/messages', label: 'Messages' },
  { to: '/app/events', label: 'Events' },
  { to: '/app/notifications', label: 'Alerts' },
  { to: '/app/profile', label: 'Profile' },
  { to: '/app/settings', label: 'Settings' },
]

export const UserLayout = () => {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <NavBar variant="user" user={user} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
          <nav className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden" aria-label="Quick navigation">
            {MOBILE_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium ${
                    isActive ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
