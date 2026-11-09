import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import adminAuthService from '../services/adminAuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const initAuth = async () => {
      try {
        // Check user auth
        if (authService.isAuthenticated()) {
          const userData = authService.getUser();
          setUser(userData);
          setIsAuthenticated(true);
        }

        // Check admin auth
        if (adminAuthService.isAuthenticated()) {
          const adminData = adminAuthService.getAdmin();
          setAdmin(adminData);
          setIsAdminAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const userData = { userId: response.userId, email: response.email, role: response.role };
      setUser(userData);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const response = await authService.register(data);
      const userData = { userId: response.userId, email: response.email, role: response.role };
      setUser(userData);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await adminAuthService.login(email, password);
      setAdmin(response.admin);
      setIsAdminAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const adminLogout = async () => {
    try {
      await adminAuthService.logout();
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      setAdmin(null);
      setIsAdminAuthenticated(false);
    }
  };

  const value = {
    user,
    admin,
    loading,
    isAuthenticated,
    isAdminAuthenticated,
    login,
    register,
    logout,
    adminLogin,
    adminLogout,
    setUser,
    setAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
