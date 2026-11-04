import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Bell,
  Compass,
  Home,
  HomeIcon,
  LogOut,
  MessageCircle,
  Settings,
  Shield,
  Users,
  UserRound,
  MapPinned,
} from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { Avatar } from '@/components/ui/Avatar'
import { useApp } from '@/store/AppProvider'
import { cn } from '@/lib/cn'

const items = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/discover', label: 'Discover', icon: Compass },
  { to: '/app/hometown', label: 'Hometown', icon: MapPinned },
  { to: '/app/communities', label: 'Communities', icon: Users },
  { to: '/app/connections', label: 'Connections', icon: UserRound },
  { to: '/app/messages', label: 'Messages', icon: MessageCircle },
  { to: '/app/notifications', label: 'Notifications', icon: Bell },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export function AppLayout() {
  const { currentUser, logout, state } = useApp()
  const navigate = useNavigate()
  const unread = state.notifications.filter((item) => item.userId === currentUser?.id && !item.read).length

  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-canvas md:grid md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-line bg-card md:flex md:flex-col">
        <div className="px-5 py-5">
          <Link to="/app">
            <Logo />
          </Link>
          <p className="mt-1 text-xs text-muted">Gurugram, Haryana</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm',
                  isActive ? 'bg-brand-soft font-medium text-brand' : 'text-muted hover:bg-canvas hover:text-ink',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.label === 'Notifications' && unread ? (
                <span className="ml-auto rounded-full bg-accent px-1.5 text-[10px] text-white">{unread}</span>
              ) : null}
            </NavLink>
          ))}
          {currentUser.role === 'admin' ? (
            <NavLink
              to="/app/admin"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm',
                  isActive ? 'bg-brand-soft font-medium text-brand' : 'text-muted hover:bg-canvas hover:text-ink',
                )
              }
            >
              <Shield className="h-4 w-4" /> Admin
            </NavLink>
          ) : null}
        </nav>
        <div className="border-t border-line p-4">
          <Link to="/app/profile" className="flex items-center gap-3">
            <Avatar src={currentUser.photo} name={currentUser.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{currentUser.name}</p>
              <p className="truncate text-xs text-muted">{currentUser.motherTongue}</p>
            </div>
          </Link>
          <button
            className="mt-3 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm text-muted hover:bg-canvas"
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-col pb-20 md:pb-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-card/90 px-4 py-3 backdrop-blur md:px-6">
          <div className="md:hidden">
            <Logo />
          </div>
          <p className="hidden text-sm text-muted md:block">Find people who make Gurugram feel familiar.</p>
          <Link to="/app/notifications" className="relative md:hidden">
            <Bell className="h-5 w-5" />
            {unread ? <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent" /> : null}
          </Link>
        </header>
        <main className="min-w-0 flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-card px-1 py-2 md:hidden">
        {[
          { to: '/app', icon: HomeIcon, label: 'Home' },
          { to: '/app/discover', icon: Compass, label: 'Discover' },
          { to: '/app/hometown', icon: MapPinned, label: 'Home' },
          { to: '/app/messages', icon: MessageCircle, label: 'Chat' },
          { to: '/app/profile', icon: UserRound, label: 'You' },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/app'}
            className={({ isActive }) =>
              cn('flex flex-col items-center gap-1 text-[11px]', isActive ? 'text-brand' : 'text-muted')
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
