import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User, UserSummary } from '@/types/user.types'
import { toUserSummary, userService } from '@/services/userService'
import { useAuthContext } from './AuthContext'

interface UserContextValue {
  users: User[]
  isLoading: boolean
  refresh: () => Promise<void>
  getUserById: (id: number) => User | undefined
  getSummaryById: (id: number) => UserSummary | undefined
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const rows = await userService.getUsers()
      setUsers(rows)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const summaries = useMemo<UserSummary[]>(() => {
    const origin =
      user?.profile.latitude !== undefined && user?.profile.longitude !== undefined
        ? { latitude: user.profile.latitude, longitude: user.profile.longitude }
        : undefined
    return users.map((row) => toUserSummary(row, origin ? { from: origin } : {}))
  }, [user, users])

  const value = useMemo<UserContextValue>(
    () => ({
      users,
      isLoading,
      refresh,
      getUserById: (id: number) => users.find((row) => row.id === id),
      getSummaryById: (id: number) => summaries.find((row) => row.id === id),
    }),
    [isLoading, refresh, summaries, users],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUserContext(): UserContextValue {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUserContext must be used inside a UserProvider')
  return context
}
