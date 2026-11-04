import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { ConnectionProvider } from '@/context/ConnectionContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { AppRoutes } from '@/routes/AppRoutes';

export function App() {
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
  );
}

export default App;
