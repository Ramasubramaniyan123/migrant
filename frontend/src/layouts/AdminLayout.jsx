import { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { adminTokenStore } from '../services/api/adminClient'
import { NavBar } from '../components/navigation/NavBar'
import { AdminSidebar } from '../components/navigation/AdminSidebar'

const MOBILE_LINKS = [
  '/admin/dashboard', '/admin/users', '/admin/communities', '/admin/posts',
  '/admin/moderation', '/admin/reports', '/admin/events', '/admin/notifications',
  '/admin/languages', '/admin/locations', '/admin/connections', '/admin/audit-logs',
  '/admin/analytics', '/admin/settings', '/admin/profile', '/admin/administrators',
].map((to) => ({ to, label: to.replace('/admin/', '').replace(/-/g, ' ') }))

export const AdminLayout = () => {
  const session = adminTokenStore.get()

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <NavBar variant="admin" adminUser={session?.admin || null} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
          <nav className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden" aria-label="Admin quick navigation">
            {MOBILE_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${
                    isActive ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <Suspense fallback={<div className="py-16 text-center text-sm text-ink-3">Loading…</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
