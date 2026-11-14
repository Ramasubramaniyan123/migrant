import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored token
    const token = localStorage.getItem('migrant-token')
    const userId = localStorage.getItem('migrant-user-id')
    
    if (token && userId) {
      // In a real app, we'd decode the JWT and set the user
      // For now, we'll simulate having a user
      setUser({ id: userId, name: 'Community Member', email: '' })
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    // Will be implemented with actual API call
    const mockResponse = {
      token: 'mock-jwt-token',
      user: { id: '1', name: credentials.email.split('@')[0], email: credentials.email }
    }
    setUser(mockResponse.user)
    localStorage.setItem('migrant-token', mockResponse.token)
    localStorage.setItem('migrant-user-id', mockResponse.user.id)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('migrant-token')
    localStorage.removeItem('migrant-user-id')
  }

  const register = async (userData) => {
    // Will be implemented with actual API call
    const mockResponse = {
      token: 'mock-jwt-register-token',
      user: { id: '1', name: userData.fullName, email: userData.email }
    }
    setUser(mockResponse.user)
    localStorage.setItem('migrant-token', mockResponse.token)
    localStorage.setItem('migrant-user-id', mockResponse.user.id)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}