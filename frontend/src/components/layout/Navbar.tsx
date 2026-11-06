import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from '@/components/common/Avatar'
import { useAuthContext } from '@/context/AuthContext'
import { useNotificationContext } from '@/context/NotificationContext'
import { APP_NAME, ROUTES } from '@/utils/constants'
import { fullName } from '@/services/userService'
import { cn } from '@/utils/helpers'

/** Top application bar with branding, notification bell and the current user menu. */
export default function Navbar() {
  const { user, logout } = useAuthContext()
  const { unreadCount } = useNotificationContext()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isMenuOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  const name = user ? fullName(user) : 'Account'

  const handleSignOut = () => {
    setIsMenuOpen(false)
    void logout().then(() => navigate('/'))
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        <Link
          to={ROUTES.dashboard}
          className="text-lg font-semibold tracking-tight text-brand-700 hover:text-brand-800"
        >
          {APP_NAME}
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.notifications}
            aria-label={
              unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'
            }
            className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-[1.1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            ) : null}
          </Link>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              aria-label="Account menu"
              className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-slate-100"
            >
              <Avatar name={name} src={user?.profile.avatarUrl} size="sm" />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn('h-4 w-4 text-slate-400 transition-transform', isMenuOpen && 'rotate-180')}
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {isMenuOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg animate-slide-up"
              >
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="truncate text-sm font-medium text-slate-900">{name}</p>
                  {user ? (
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  ) : null}
                </div>
                <Link
                  role="menuitem"
                  to={ROUTES.profile}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  My profile
                </Link>
                <Link
                  role="menuitem"
                  to={ROUTES.settings}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Settings
                </Link>
                <button
                  role="menuitem"
                  type="button"
                  onClick={handleSignOut}
                  className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
