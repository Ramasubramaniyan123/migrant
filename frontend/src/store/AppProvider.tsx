import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadState, resetState, saveState } from '@/lib/storage'
import { uid } from '@/lib/id'
import { avatarDataUri } from '@/lib/avatar'
import type {
  AppState,
  Language,
  PrivacySettings,
  User,
} from '@/types'

type RegisterInput = {
  name: string
  email: string
  password: string
}

type OnboardingInput = {
  photo: string
  dob: string
  ageConfirmed: boolean
  bio: string
  motherTongue: Language
  languages: Language[]
  homeState: string
  hometown: string
  district: string
  currentCity: string
  locality: string
  interests: string[]
  profession: string
}

type AppContextValue = {
  state: AppState
  currentUser: User | null
  login: (email: string, password: string) => string | null
  logout: () => void
  register: (input: RegisterInput) => string | null
  completeOnboarding: (input: OnboardingInput) => void
  updateProfile: (patch: Partial<User>) => void
  sendRequest: (toUserId: string) => void
  respondRequest: (connectionId: string, status: 'accepted' | 'rejected') => void
  sendMessage: (otherUserId: string, text: string) => void
  conversationWith: (otherUserId: string) => string | null
  joinCommunity: (communityId: string) => void
  leaveCommunity: (communityId: string) => void
  createPost: (communityId: string, content: string) => void
  toggleLike: (postId: string) => void
  addComment: (postId: string, text: string) => void
  markNotificationsRead: () => void
  updatePrivacy: (privacy: Partial<PrivacySettings>) => void
  blockUser: (userId: string) => void
  unblockUser: (userId: string) => void
  reportUser: (userId: string, reason: string, details: string) => void
  reportPost: (postId: string, reason: string) => void
  deleteAccount: () => void
  resetDemo: () => void
  suspendUser: (userId: string) => void
  restoreUser: (userId: string) => void
  reviewReport: (reportId: string, status: 'reviewed' | 'dismissed') => void
  unflagPost: (postId: string) => void
  isConnected: (userId: string) => boolean
  requestState: (userId: string) => 'none' | 'pending-out' | 'pending-in' | 'accepted' | 'rejected'
  isBlocked: (userId: string) => boolean
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const currentUser = useMemo(
    () => state.users.find((user) => user.id === state.currentUserId && user.status !== 'deleted') ?? null,
    [state.users, state.currentUserId],
  )

  const notify = (userId: string, title: string, body: string, href: string) => ({
    id: uid('n'),
    userId,
    title,
    body,
    createdAt: new Date().toISOString(),
    read: false,
    href,
  })

  const login = useCallback((email: string, password: string) => {
    const user = state.users.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password && item.status !== 'deleted',
    )
    if (!user) return 'Invalid email or password.'
    if (user.status === 'suspended') return 'This account has been suspended.'
    setState((prev) => ({ ...prev, currentUserId: user.id }))
    return null
  }, [state.users])

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, currentUserId: null }))
  }, [])

  const register = useCallback((input: RegisterInput) => {
    const exists = state.users.some((user) => user.email.toLowerCase() === input.email.trim().toLowerCase())
    if (exists) return 'An account with this email already exists.'
    const id = uid('user')
    const user: User = {
      id,
      email: input.email.trim().toLowerCase(),
      password: input.password,
      name: input.name.trim(),
      photo: avatarDataUri(input.name.trim()),
      age: 18,
      bio: '',
      motherTongue: 'Hindi',
      languages: ['Hindi'],
      homeState: '',
      hometown: '',
      district: '',
      currentCity: 'Gurugram',
      locality: 'Cyber City',
      profession: '',
      interests: [],
      joinedCommunityIds: [],
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      onboardingComplete: false,
      privacy: {
        profileVisibility: 'public',
        locationVisibility: 'approximate',
        pauseDiscovery: false,
      },
    }
    setState((prev) => ({ ...prev, users: [...prev.users, user], currentUserId: id }))
    return null
  }, [state.users])

  const completeOnboarding = useCallback((input: OnboardingInput) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((user) =>
        user.id === prev.currentUserId
          ? {
              ...user,
              photo: input.photo || user.photo,
              dob: input.dob,
              age: Math.max(18, new Date().getFullYear() - new Date(input.dob).getFullYear()),
              bio: input.bio,
              motherTongue: input.motherTongue,
              languages: Array.from(new Set([input.motherTongue, ...input.languages])),
              homeState: input.homeState,
              hometown: input.hometown,
              district: input.district,
              currentCity: input.currentCity,
              locality: input.locality,
              interests: input.interests,
              profession: input.profession,
              onboardingComplete: true,
              joinedCommunityIds: prev.communities
                .filter((community) => community.language === input.motherTongue)
                .map((community) => community.id),
            }
          : user,
      ),
      communities: prev.communities.map((community) => {
        if (community.language !== input.motherTongue || !prev.currentUserId) return community
        if (community.memberIds.includes(prev.currentUserId)) return community
        return { ...community, memberIds: [...community.memberIds, prev.currentUserId] }
      }),
    }))
  }, [])

  const updateProfile = useCallback((patch: Partial<User>) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((user) => (user.id === prev.currentUserId ? { ...user, ...patch } : user)),
    }))
  }, [])

  const requestState = useCallback((userId: string) => {
    if (!state.currentUserId) return 'none' as const
    const match = state.connections.find(
      (item) =>
        (item.fromUserId === state.currentUserId && item.toUserId === userId) ||
        (item.toUserId === state.currentUserId && item.fromUserId === userId),
    )
    if (!match) return 'none' as const
    if (match.status === 'accepted') return 'accepted' as const
    if (match.status === 'rejected') return 'rejected' as const
    if (match.fromUserId === state.currentUserId) return 'pending-out' as const
    return 'pending-in' as const
  }, [state.connections, state.currentUserId])

  const isConnected = useCallback((userId: string) => requestState(userId) === 'accepted', [requestState])

  const isBlocked = useCallback((userId: string) => {
    if (!state.currentUserId) return false
    return state.blocked.some(
      (item) =>
        (item.blockerId === state.currentUserId && item.blockedId === userId) ||
        (item.blockerId === userId && item.blockedId === state.currentUserId),
    )
  }, [state.blocked, state.currentUserId])

  const sendRequest = useCallback((toUserId: string) => {
    setState((prev) => {
      if (!prev.currentUserId || prev.currentUserId === toUserId) return prev
      const exists = prev.connections.find(
        (item) =>
          (item.fromUserId === prev.currentUserId && item.toUserId === toUserId) ||
          (item.toUserId === prev.currentUserId && item.fromUserId === toUserId),
      )
      if (exists && exists.status !== 'rejected') return prev
      const fromUser = prev.users.find((user) => user.id === prev.currentUserId)
      const connection = {
        id: uid('c'),
        fromUserId: prev.currentUserId,
        toUserId,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      }
      return {
        ...prev,
        connections: [...prev.connections.filter((item) => item.id !== exists?.id), connection],
        notifications: [
          notify(toUserId, 'New connection request', `${fromUser?.name ?? 'Someone'} sent you a connection request.`, '/app/connections'),
          ...prev.notifications,
        ],
      }
    })
  }, [])

  const respondRequest = useCallback((connectionId: string, status: 'accepted' | 'rejected') => {
    setState((prev) => {
      const connection = prev.connections.find((item) => item.id === connectionId)
      if (!connection) return prev
      const fromUser = prev.users.find((user) => user.id === prev.currentUserId)
      let conversations = prev.conversations
      if (status === 'accepted') {
        const already = conversations.some(
          (item) => item.participantIds.includes(connection.fromUserId) && item.participantIds.includes(connection.toUserId),
        )
        if (!already) {
          conversations = [
            ...conversations,
            { id: uid('conv'), participantIds: [connection.fromUserId, connection.toUserId] },
          ]
        }
      }
      return {
        ...prev,
        connections: prev.connections.map((item) => (item.id === connectionId ? { ...item, status } : item)),
        conversations,
        notifications:
          status === 'accepted'
            ? [
                notify(connection.fromUserId, 'Request accepted', `${fromUser?.name ?? 'Someone'} accepted your connection request.`, '/app/messages'),
                ...prev.notifications,
              ]
            : prev.notifications,
      }
    })
  }, [])

  const conversationWith = useCallback((otherUserId: string) => {
    if (!state.currentUserId) return null
    return (
      state.conversations.find(
        (item) => item.participantIds.includes(state.currentUserId!) && item.participantIds.includes(otherUserId),
      )?.id ?? null
    )
  }, [state.conversations, state.currentUserId])

  const sendMessage = useCallback((otherUserId: string, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setState((prev) => {
      if (!prev.currentUserId) return prev
      const connected = prev.connections.some(
        (item) =>
          item.status === 'accepted' &&
          ((item.fromUserId === prev.currentUserId && item.toUserId === otherUserId) ||
            (item.toUserId === prev.currentUserId && item.fromUserId === otherUserId)),
      )
      if (!connected) return prev
      let conversations = prev.conversations
      let conversation = conversations.find(
        (item) => item.participantIds.includes(prev.currentUserId!) && item.participantIds.includes(otherUserId),
      )
      const senderId = prev.currentUserId
      if (!conversation) {
        conversation = { id: uid('conv'), participantIds: [senderId, otherUserId] }
        conversations = [...conversations, conversation]
      }
      return {
        ...prev,
        conversations,
        messages: [
          ...prev.messages,
          {
            id: uid('m'),
            conversationId: conversation.id,
            senderId,
            text: trimmed,
            createdAt: new Date().toISOString(),
          },
        ],
        notifications: [
          notify(otherUserId, 'New message', `${prev.users.find((user) => user.id === prev.currentUserId)?.name ?? 'Someone'} sent you a message.`, '/app/messages'),
          ...prev.notifications,
        ],
      }
    })
  }, [])

  const joinCommunity = useCallback((communityId: string) => {
    setState((prev) => {
      const userId = prev.currentUserId
      if (!userId) return prev
      return {
        ...prev,
        communities: prev.communities.map((community) =>
          community.id === communityId && !community.memberIds.includes(userId)
            ? { ...community, memberIds: [...community.memberIds, userId] }
            : community,
        ),
        users: prev.users.map((user) =>
          user.id === userId && !user.joinedCommunityIds.includes(communityId)
            ? { ...user, joinedCommunityIds: [...user.joinedCommunityIds, communityId] }
            : user,
        ),
      }
    })
  }, [])

  const leaveCommunity = useCallback((communityId: string) => {
    setState((prev) => {
      if (!prev.currentUserId) return prev
      return {
        ...prev,
        communities: prev.communities.map((community) =>
          community.id === communityId
            ? { ...community, memberIds: community.memberIds.filter((id) => id !== prev.currentUserId) }
            : community,
        ),
        users: prev.users.map((user) =>
          user.id === prev.currentUserId
            ? { ...user, joinedCommunityIds: user.joinedCommunityIds.filter((id) => id !== communityId) }
            : user,
        ),
      }
    })
  }, [])

  const createPost = useCallback((communityId: string, content: string) => {
    const trimmed = content.trim()
    if (!trimmed) return
    setState((prev) => {
      if (!prev.currentUserId) return prev
      return {
        ...prev,
        posts: [
          {
            id: uid('p'),
            communityId,
            authorId: prev.currentUserId,
            content: trimmed,
            createdAt: new Date().toISOString(),
            likes: [],
            comments: [],
            flagged: false,
          },
          ...prev.posts,
        ],
      }
    })
  }, [])

  const toggleLike = useCallback((postId: string) => {
    setState((prev) => {
      if (!prev.currentUserId) return prev
      return {
        ...prev,
        posts: prev.posts.map((post) => {
          if (post.id !== postId) return post
          const liked = post.likes.includes(prev.currentUserId!)
          return {
            ...post,
            likes: liked ? post.likes.filter((id) => id !== prev.currentUserId) : [...post.likes, prev.currentUserId!],
          }
        }),
      }
    })
  }, [])

  const addComment = useCallback((postId: string, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setState((prev) => {
      if (!prev.currentUserId) return prev
      const author = prev.users.find((user) => user.id === prev.currentUserId)
      return {
        ...prev,
        posts: prev.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  { id: uid('cm'), authorId: prev.currentUserId!, text: trimmed, createdAt: new Date().toISOString() },
                ],
              }
            : post,
        ),
        notifications: prev.posts
          .filter((post) => post.id === postId && post.authorId !== prev.currentUserId)
          .map((post) => notify(post.authorId, 'New comment', `${author?.name ?? 'Someone'} commented on your post.`, `/app/communities/${post.communityId}`))
          .concat(prev.notifications),
      }
    })
  }, [])

  const markNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((item) =>
        item.userId === prev.currentUserId ? { ...item, read: true } : item,
      ),
    }))
  }, [])

  const updatePrivacy = useCallback((privacy: Partial<PrivacySettings>) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((user) =>
        user.id === prev.currentUserId ? { ...user, privacy: { ...user.privacy, ...privacy } } : user,
      ),
    }))
  }, [])

  const blockUser = useCallback((userId: string) => {
    setState((prev) => {
      if (!prev.currentUserId) return prev
      return {
        ...prev,
        blocked: [...prev.blocked.filter((item) => !(item.blockerId === prev.currentUserId && item.blockedId === userId)), { blockerId: prev.currentUserId, blockedId: userId }],
        connections: prev.connections.filter(
          (item) =>
            !((item.fromUserId === prev.currentUserId && item.toUserId === userId) || (item.toUserId === prev.currentUserId && item.fromUserId === userId)),
        ),
      }
    })
  }, [])

  const unblockUser = useCallback((userId: string) => {
    setState((prev) => ({
      ...prev,
      blocked: prev.blocked.filter((item) => !(item.blockerId === prev.currentUserId && item.blockedId === userId)),
    }))
  }, [])

  const reportUser = useCallback((userId: string, reason: string, details: string) => {
    setState((prev) => {
      if (!prev.currentUserId) return prev
      return {
        ...prev,
        reports: [
          {
            id: uid('r'),
            reporterId: prev.currentUserId,
            targetUserId: userId,
            reason,
            details,
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
          ...prev.reports,
        ],
      }
    })
  }, [])

  const reportPost = useCallback((postId: string, reason: string) => {
    setState((prev) => {
      if (!prev.currentUserId) return prev
      return {
        ...prev,
        posts: prev.posts.map((post) => (post.id === postId ? { ...post, flagged: true } : post)),
        reports: [
          {
            id: uid('r'),
            reporterId: prev.currentUserId,
            targetPostId: postId,
            reason,
            details: reason,
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
          ...prev.reports,
        ],
      }
    })
  }, [])

  const deleteAccount = useCallback(() => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((user) => (user.id === prev.currentUserId ? { ...user, status: 'deleted' } : user)),
      currentUserId: null,
    }))
  }, [])

  const resetDemo = useCallback(() => {
    const next = resetState()
    setState(next)
  }, [])

  const suspendUser = useCallback((userId: string) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((user) => (user.id === userId ? { ...user, status: 'suspended' } : user)),
    }))
  }, [])

  const restoreUser = useCallback((userId: string) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((user) => (user.id === userId ? { ...user, status: 'active' } : user)),
    }))
  }, [])

  const reviewReport = useCallback((reportId: string, status: 'reviewed' | 'dismissed') => {
    setState((prev) => ({
      ...prev,
      reports: prev.reports.map((item) => (item.id === reportId ? { ...item, status } : item)),
    }))
  }, [])

  const unflagPost = useCallback((postId: string) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((post) => (post.id === postId ? { ...post, flagged: false } : post)),
    }))
  }, [])

  const value: AppContextValue = {
    state,
    currentUser,
    login,
    logout,
    register,
    completeOnboarding,
    updateProfile,
    sendRequest,
    respondRequest,
    sendMessage,
    conversationWith,
    joinCommunity,
    leaveCommunity,
    createPost,
    toggleLike,
    addComment,
    markNotificationsRead,
    updatePrivacy,
    blockUser,
    unblockUser,
    reportUser,
    reportPost,
    deleteAccount,
    resetDemo,
    suspendUser,
    restoreUser,
    reviewReport,
    unflagPost,
    isConnected,
    requestState,
    isBlocked,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
