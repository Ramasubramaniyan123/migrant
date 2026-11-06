import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Administrator } from '@/types/admin.types'
import { useAdminAuthContext } from './AdminAuthContext'

interface AdminUserContextValue {
  admin: Administrator | null
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

const AdminUserContext = createContext<AdminUserContextValue | null>(null)

export function AdminUserProvider({ children }: { children: ReactNode }) {
  const { admin } = useAdminAuthContext()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const value = useMemo<AdminUserContextValue>(
    () => ({
      admin,
      sidebarCollapsed,
      toggleSidebar: () => setSidebarCollapsed((c) => !c),
      setSidebarCollapsed,
    }),
    [admin, sidebarCollapsed],
  )

  return <AdminUserContext.Provider value={value}>{children}</AdminUserContext.Provider>
}

export function useAdminUserContext(): AdminUserContextValue {
  const ctx = useContext(AdminUserContext)
  if (!ctx) throw new Error('useAdminUserContext must be used within AdminUserProvider')
  return ctx
}
