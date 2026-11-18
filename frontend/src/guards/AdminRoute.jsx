import { Navigate, Outlet } from 'react-router-dom'
import { adminTokenStore } from '../services/api/adminClient'

export const AdminRoute = () => {
  const session = adminTokenStore.get()

  if (!session?.token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
