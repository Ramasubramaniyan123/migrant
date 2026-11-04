import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { STORAGE_KEYS } from '@/utils/constants';
import type { User, LoginRequest, RegisterRequest } from '@/types';
import usersData from '@/data/users.json';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Default to demo user for seamless prototype exploration
        const defaultUser = (usersData as User[])[0];
        if (defaultUser) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock-jwt-token-demo');
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
          setUser(defaultUser);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const matchedUser = (usersData as User[]).find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
    );

    const loggedInUser: User = matchedUser || {
      id: `user-${Date.now()}`,
      email: credentials.email,
      firstName: credentials.email.split('@')[0],
      lastName: 'User',
      fullName: credentials.email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
      bio: 'New member in Gurugram',
      profession: 'Professional',
      role: credentials.email.includes('admin') ? 'admin' : 'user',
      currentLocation: { city: 'Gurugram', state: 'Haryana', locality: 'Cyber City' },
      hometown: { city: 'Madurai', state: 'Tamil Nadu' },
      motherTongue: 'Tamil',
      additionalLanguages: [],
      interests: ['Networking'],
      privacySettings: {
        profileVisibility: 'everyone',
        showDateOfBirth: false,
        showHometown: true,
        showExactLocality: true,
        showProfession: true,
        appearInDiscovery: true,
        appearInHometownSearch: true,
        showDistance: true,
        locationAccuracy: 'exact',
      },
      joinedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      onboardingComplete: true,
    };

    localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock-jwt-token-' + loggedInUser.id);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setIsLoading(false);
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}`,
      bio: 'Exploring new connections in Gurugram',
      profession: 'Professional',
      role: 'user',
      currentLocation: { city: 'Gurugram', state: 'Haryana', locality: 'Cyber City' },
      hometown: { city: 'Chennai', state: 'Tamil Nadu' },
      motherTongue: 'Tamil',
      additionalLanguages: [],
      interests: ['Networking', 'Cricket'],
      privacySettings: {
        profileVisibility: 'everyone',
        showDateOfBirth: false,
        showHometown: true,
        showExactLocality: true,
        showProfession: true,
        appearInDiscovery: true,
        appearInHometownSearch: true,
        showDistance: true,
        locationAccuracy: 'exact',
      },
      joinedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      onboardingComplete: false,
    };

    localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock-jwt-token-' + newUser.id);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    setUser(newUser);
    setIsLoading(false);
  };

  const logout = async () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  };

  const refreshUser = async () => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
