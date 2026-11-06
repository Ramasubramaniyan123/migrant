import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ConnectionProvider } from '@/context/ConnectionContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { UserProvider } from '@/context/UserContext'
import AppRoutes from '@/routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <ConnectionProvider>
            <NotificationProvider>
              <AppRoutes />
            </NotificationProvider>
          </ConnectionProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
