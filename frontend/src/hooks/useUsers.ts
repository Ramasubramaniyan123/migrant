import { useUserContext } from '@/context/UserContext'

/** Directory-style access to every user known to the app. */
export function useUsers() {
  return useUserContext()
}
