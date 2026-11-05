import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { ConnectionProvider } from '@/context/ConnectionContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ToastProvider } from '@/components/common/Toast';
import { AppRoutes } from '@/routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <UserProvider>
            <ConnectionProvider>
              <NotificationProvider>
                <AppRoutes />
              </NotificationProvider>
            </ConnectionProvider>
          </UserProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
