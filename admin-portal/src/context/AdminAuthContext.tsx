import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Administrator, AdminRole } from '@/types/admin.types'
import { adminAuthService } from '@/services/adminAuthService'
import { hasPermission, hasAnyPermission } from '@/utils/permissions'
import type { Permission } from '@/utils/permissions'
import { ApiError } from '@/services/api'

const STORAGE_KEY = 'admin_portal_session'

interface AdminAuthContextValue {
  admin: Administrator | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  can: (permission: Permission) => boolean
  canAny: (permissions: Permission[]) => boolean
  role: AdminRole | null
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

interface StoredSession {
  admin: Administrator
  token: string
}

function readSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredSession) : null
  } catch {
    return null
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(() => readSession())
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await adminAuthService.login({ email, password })
      const next: StoredSession = { admin: result.admin, token: result.token }
      setSession(next)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch (err) {
      throw err instanceof Error ? err : new ApiError('Login failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await adminAuthService.logout()
    setSession(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // Keep session fresh if admin record changed (e.g. suspended)
  useEffect(() => {
    if (!session) return
    let cancelled = false
    adminAuthService
      .listAdmins()
      .then((admins) => {
        if (cancelled) return
        const fresh = admins.find((a) => a.id === session.admin.id)
        if (!fresh || fresh.status === 'SUSPENDED') {
          setSession(null)
          localStorage.removeItem(STORAGE_KEY)
        } else if (fresh !== session.admin) {
          const next = { ...session, admin: fresh }
          setSession(next)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        }
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [session])

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      admin: session?.admin ?? null,
      token: session?.token ?? null,
      isAuthenticated: !!session,
      isLoading,
      login,
      logout,
      can: (permission) => hasPermission(session?.admin.role, permission),
      canAny: (permissions) => hasAnyPermission(session?.admin.role, permissions),
      role: session?.admin.role ?? null,
    }),
    [session, isLoading, login, logout],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuthContext(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuthContext must be used within AdminAuthProvider')
  return ctx
}
