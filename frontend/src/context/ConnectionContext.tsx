import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  Connection,
  ConnectionStatus,
  MatchReason,
} from '@/types/connection.types'
import { connectionService } from '@/services/connectionService'
import { useAuthContext } from './AuthContext'

interface ConnectionContextValue {
  connections: Connection[]
  receivedRequests: Connection[]
  sentRequests: Connection[]
  accepted: Connection[]
  incomingCount: number
  isLoading: boolean
  refresh: () => Promise<void>
  sendRequest: (receiverId: number, matchScore: number, matchedBy: MatchReason) => Promise<void>
  accept: (connectionId: number) => Promise<void>
  reject: (connectionId: number) => Promise<void>
  cancel: (connectionId: number) => Promise<void>
  remove: (connectionId: number) => Promise<void>
  getStatus: (otherUserId: number) => ConnectionStatus | null
  isConnected: (otherUserId: number) => boolean
  acceptedUserIds: number[]
}

const ConnectionContext = createContext<ConnectionContextValue | undefined>(undefined)

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext()
  const [connections, setConnections] = useState<Connection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const userId = user?.id

  const refresh = useCallback(async () => {
    if (!userId) {
      setConnections([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      setConnections(await connectionService.getForUser(userId))
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const receivedRequests = useMemo(
    () =>
      userId
        ? connections.filter((row) => row.receiverId === userId && row.status === 'PENDING')
        : [],
    [connections, userId],
  )

  const sentRequests = useMemo(
    () =>
      userId
        ? connections.filter((row) => row.requesterId === userId && row.status === 'PENDING')
        : [],
    [connections, userId],
  )

  const accepted = useMemo(
    () => connections.filter((row) => row.status === 'ACCEPTED'),
    [connections],
  )

  const acceptedUserIds = useMemo(
    () =>
      userId
        ? accepted.map((row) => (row.requesterId === userId ? row.receiverId : row.requesterId))
        : [],
    [accepted, userId],
  )

  const sendRequest = useCallback(
    async (receiverId: number, matchScore: number, matchedBy: MatchReason) => {
      if (!userId) return
      await connectionService.sendRequest(userId, receiverId, matchScore, matchedBy)
      await refresh()
    },
    [refresh, userId],
  )

  const accept = useCallback(
    async (connectionId: number) => {
      await connectionService.acceptRequest(connectionId)
      await refresh()
    },
    [refresh],
  )

  const reject = useCallback(
    async (connectionId: number) => {
      await connectionService.rejectRequest(connectionId)
      await refresh()
    },
    [refresh],
  )

  const cancel = useCallback(
    async (connectionId: number) => {
      await connectionService.cancelRequest(connectionId)
      await refresh()
    },
    [refresh],
  )

  const remove = useCallback(
    async (connectionId: number) => {
      await connectionService.removeConnection(connectionId)
      await refresh()
    },
    [refresh],
  )

  const getStatus = useCallback(
    (otherUserId: number): ConnectionStatus | null => {
      if (!userId) return null
      return connectionService.statusBetween(userId, otherUserId)?.status ?? null
    },
    [userId],
  )

  const value = useMemo<ConnectionContextValue>(
    () => ({
      connections,
      receivedRequests,
      sentRequests,
      accepted,
      incomingCount: receivedRequests.length,
      isLoading,
      refresh,
      sendRequest,
      accept,
      reject,
      cancel,
      remove,
      getStatus,
      isConnected: (otherUserId: number) => acceptedUserIds.includes(otherUserId),
      acceptedUserIds,
    }),
    [
      accept,
      accepted,
      acceptedUserIds,
      cancel,
      connections,
      getStatus,
      isLoading,
      receivedRequests,
      refresh,
      reject,
      remove,
      sendRequest,
      sentRequests,
    ],
  )

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>
}

export function useConnectionContext(): ConnectionContextValue {
  const context = useContext(ConnectionContext)
  if (!context) throw new Error('useConnectionContext must be used inside a ConnectionProvider')
  return context
}
