import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User, UserProfile } from '@/types/user.types'
import {
  authService,
  type LoginPayload,
  type RegisterPayload,
} from '@/services/authService'
import { userService } from '@/services/userService'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  error: string | null
  login: (payload: LoginPayload) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>
  completeOnboarding: (patch: Partial<UserProfile>) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const session = authService.getCurrentSession()
    setUser(session?.user ?? null)
    setIsLoading(false)
  }, [])

  const persist = useCallback((next: User) => {
    authService.updateStoredUser(next)
    setUser(next)
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true)
    setError(null)
    try {
      const session = await authService.login(payload)
      persist(session.user)
      return session.user
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unable to sign in'
      setError(message)
      throw cause
    } finally {
      setIsLoading(false)
    }
  }, [persist])

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true)
    setError(null)
    try {
      const session = await authService.register(payload)
      persist(session.user)
      return session.user
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unable to create account'
      setError(message)
      throw cause
    } finally {
      setIsLoading(false)
    }
  }, [persist])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const updateProfile = useCallback(
    async (patch: Partial<UserProfile>) => {
      if (!user) return
      const updated = await userService.updateProfile(user.id, patch)
      persist(updated)
    },
    [persist, user],
  )

  const completeOnboarding = useCallback(
    async (patch: Partial<UserProfile>) => {
      if (!user) return
      const updated = await userService.completeOnboarding(user.id, patch)
      persist(updated)
    },
    [persist, user],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'ADMIN',
      isLoading,
      error,
      login,
      register,
      logout,
      updateProfile,
      completeOnboarding,
      clearError: () => setError(null),
    }),
    [completeOnboarding, error, isLoading, login, logout, register, updateProfile, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuthContext must be used inside an AuthProvider')
  return context
}
