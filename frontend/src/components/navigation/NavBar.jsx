import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Sun, Moon, Monitor, LogOut, User as UserIcon, LayoutDashboard, Bell } from 'lucide-react'
import { useTheme, useAuth } from '../../contexts'
import { adminAuthService } from '../../services/admin/adminService'
import { adminTokenStore } from '../../services/api/adminClient'
import { displayNameFromEmail } from '../../utils/format'

const PUBLIC_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/features', label: 'Features' },
  { to: '/contact', label: 'Contact' },
]

const USER_LINKS = [
  { to: '/app/home', label: 'Home' },
  { to: '/app/discover', label: 'Discover' },
  { to: '/app/communities', label: 'Communities' },
  { to: '/app/feed', label: 'Feed' },
  { to: '/app/events', label: 'Events' },
]

const ADMIN_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/communities', label: 'Communities' },
  { to: '/admin/moderation', label: 'Moderation' },
  { to: '/admin/analytics', label: 'Analytics' },
]

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-hover hover:text-ink'
  }`

export const NavBar = ({ variant = 'public', user = null, adminUser = null }) => {
  const { mode, setThemeMode, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const links = variant === 'admin' ? ADMIN_LINKS : variant === 'user' ? USER_LINKS : PUBLIC_LINKS
  const isAuthed = variant !== 'public'

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const handleLogout = async () => {
    setUserMenuOpen(false)
    setMobileOpen(false)
    if (variant === 'admin') {
      try { await adminAuthService.logout() } catch { /* ignore */ }
      adminTokenStore.clear()
      navigate('/login')
    } else {
      await logout()
      navigate('/')
    }
  }

  const ThemeIcon = mode === 'dark' ? Moon : mode === 'light' ? Sun : Monitor

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4" aria-label="Main navigation">
        <Link to={variant === 'admin' ? '/admin/dashboard' : '/'} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent font-display text-lg font-bold text-accent-ink">
            M
          </span>
          <span className="font-display text-lg font-bold text-ink">
            {variant === 'admin' ? 'Admin' : 'Migrant Community'}
          </span>
        </Link>

        <div className="ml-4 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Theme control */}
          <div className="flex items-center rounded-lg border border-line p-0.5" role="group" aria-label="Theme">
            {[
              { m: 'light', Icon: Sun, label: 'Light' },
              { m: 'dark', Icon: Moon, label: 'Dark' },
              { m: 'system', Icon: Monitor, label: 'System' },
            ].map(({ m, Icon, label }) => (
              <button
                key={m}
                type="button"
                onClick={() => setThemeMode(m)}
                aria-label={`${label} theme`}
                aria-pressed={mode === m}
                className={`rounded-md p-1.5 transition-colors ${
                  mode === m ? 'bg-accent-soft text-accent' : 'text-ink-3 hover:text-ink'
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          {variant === 'user' && (
            <Link
              to="/app/notifications"
              className="hidden rounded-lg p-2 text-ink-2 hover:bg-hover md:block"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Link>
          )}

          {isAuthed ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-hover"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-ink">
                  {(displayNameFromEmail(user?.email) || adminUser?.name || adminUser?.email || '?')[0].toUpperCase()}
                </span>
                <span className="hidden max-w-[140px] truncate text-sm font-medium text-ink md:block">
                  {user ? displayNameFromEmail(user.email) : (adminUser?.name || adminUser?.email)}
                </span>
              </button>
              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-line bg-surface shadow-lift"
                >
                  {variant === 'user' && (
                    <>
                      <MenuLink to="/app/profile" icon={UserIcon} label="Profile" onClick={() => setUserMenuOpen(false)} />
                      <MenuLink to="/app/settings" icon={LayoutDashboard} label="Settings" onClick={() => setUserMenuOpen(false)} />
                    </>
                  )}
                  {variant === 'admin' && (
                    <MenuLink to="/admin/profile" icon={UserIcon} label="Admin profile" onClick={() => setUserMenuOpen(false)} />
                  )}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-hover"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="btn-ghost btn-sm">Sign in</Link>
              <Link to="/register" className="btn-accent btn-sm">Get started</Link>
            </div>
          )}

          <button
            type="button"
            className="rounded-lg p-2 text-ink-2 hover:bg-hover md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-line bg-surface md:hidden">
          <div className="space-y-1 px-4 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-hover'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            {!isAuthed && (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="btn-outline flex-1" onClick={() => setMobileOpen(false)}>Sign in</Link>
                <Link to="/register" className="btn-accent flex-1" onClick={() => setMobileOpen(false)}>Get started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

const MenuLink = ({ to, icon: Icon, label, onClick }) => (
  <Link
    to={to}
    role="menuitem"
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink hover:bg-hover"
  >
    <Icon className="h-4 w-4 text-ink-3" /> {label}
  </Link>
)
