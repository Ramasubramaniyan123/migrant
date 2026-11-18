import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { authService } from '../services/auth/authService'
import { adminAuthService } from '../services/admin/adminService'
import { tokenStore } from '../services/api/axiosInstance'
import { adminTokenStore } from '../services/api/adminClient'
import { errorMessage } from '../services/api/apiClient'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  const persistSession = useCallback((authResponse) => {
    if (!authResponse?.accessToken) return
    tokenStore.set({
      accessToken: authResponse.accessToken,
      refreshToken: authResponse.refreshToken,
    })
    setUser({
      id: authResponse.userId,
      email: authResponse.email,
      role: authResponse.role,
    })
  }, [])

  // Restore session on mount.
  useEffect(() => {
    mounted.current = true
    const session = tokenStore.get()
    const adminSession = adminTokenStore.get()

    if (adminSession?.token) {
      // Admin session exists - restore it
      setLoading(false)
      // Note: Admin session doesn't have a /me endpoint, so we just set basic info
      // The actual admin data would need to be fetched separately if needed
      return () => { mounted.current = false }
    }

    if (!session?.accessToken) {
      setLoading(false)
      return undefined
    }
    authService.me()
      .then((summary) => {
        if (mounted.current && summary) {
          setUser({
            id: summary.userId,
            email: summary.email,
            role: summary.role,
            verified: summary.verified,
            active: summary.active,
          })
        } else if (mounted.current) {
          tokenStore.clear()
        }
      })
      .catch(() => {
        if (mounted.current) tokenStore.clear()
      })
      .finally(() => {
        if (mounted.current) setLoading(false)
      })
    return () => { mounted.current = false }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    // Try regular user login first
    try {
      const res = await authService.login({ email, password })
      persistSession(res)
      return { success: true, isAdmin: false, data: res }
    } catch (userErr) {
      // If regular login fails, try admin login
      try {
        const adminRes = await adminAuthService.login({ email, password })
        // Store admin token in admin-specific storage (use 'token' key to match adminClient)
        adminTokenStore.set({
          token: adminRes.token,
        })
        setUser({
          id: adminRes.admin.id,
          email: adminRes.admin.email,
          role: adminRes.admin.role,
          isAdmin: true,
        })
        return { success: true, isAdmin: true, data: adminRes }
      } catch (adminErr) {
        // Both failed, throw the original user error
        throw userErr
      }
    }
  }, [persistSession])

  const register = useCallback(async ({ email, password, confirmPassword }) => {
    const res = await authService.register({ email, password, confirmPassword })
    persistSession(res)
    return res
  }, [persistSession])

  const googleLogin = useCallback(async (idToken) => {
    const res = await authService.googleLogin(idToken)
    persistSession(res)
    return res
  }, [persistSession])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Ignore logout errors — clear local session regardless.
    }
    try {
      await adminAuthService.logout()
    } catch {
      // Ignore admin logout errors
    }
    tokenStore.clear()
    adminTokenStore.clear()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const summary = await authService.me()
    if (summary) {
      setUser((prev) => ({
        ...(prev || {}),
        id: summary.userId,
        email: summary.email,
        role: summary.role,
        verified: summary.verified,
        active: summary.active,
      }))
    }
    return summary
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role && user.role !== 'USER',
    login,
    register,
    googleLogin,
    logout,
    refreshUser,
    authErrorMessage: errorMessage,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
