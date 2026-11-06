import { useAuthContext } from '@/context/AuthContext'

/** Convenience hook around `AuthContext`. */
export function useAuth() {
  return useAuthContext()
}
