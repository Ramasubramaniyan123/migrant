import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const AdminRoute = ({ children }) => {
  const { user } = useAuth()
  const location = useLocation()

  if (!user || user.role !== 'admin') {
    return <Navigate to="/app" replace />
  }

  return children
}