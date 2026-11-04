import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, UpdateProfileRequest } from '@/types';
import initialUsers from '@/data/users.json';

interface UserContextType {
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  getUserById: (id: string) => User | undefined;
  searchUsers: (query: string) => User[];
  filterUsers: (options: { language?: string; hometown?: string; locality?: string; maxDistance?: number }) => User[];
  updateCurrentUserProfile: (data: UpdateProfileRequest) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('migrant_users_data');
    return saved ? JSON.parse(saved) : (initialUsers as User[]);
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user_data');
    return savedUser ? JSON.parse(savedUser) : (initialUsers as User[])[0] || null;
  });

  useEffect(() => {
    localStorage.setItem('migrant_users_data', JSON.stringify(users));
  }, [users]);

  const getUserById = (id: string): User | undefined => {
    return users.find((u) => u.id === id);
  };

  const searchUsers = (query: string): User[] => {
    if (!query.trim()) return users;
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.bio?.toLowerCase().includes(q) ||
        u.profession?.toLowerCase().includes(q) ||
        (typeof u.motherTongue === 'string' && u.motherTongue.toLowerCase().includes(q)) ||
        (u.hometown?.city && u.hometown.city.toLowerCase().includes(q)) ||
        (u.hometown?.state && u.hometown.state.toLowerCase().includes(q))
    );
  };

  const filterUsers = (options: {
    language?: string;
    hometown?: string;
    locality?: string;
    maxDistance?: number;
  }): User[] => {
    return users.filter((u) => {
      if (options.language && options.language !== 'All') {
        const langStr = typeof u.motherTongue === 'string' ? u.motherTongue : (u.motherTongue as any)?.name;
        const speaksLang = langStr === options.language || u.languages?.includes(options.language as any);
        if (!speaksLang) return false;
      }
      if (options.hometown && options.hometown.trim()) {
        const htCity = u.hometown?.city?.toLowerCase() || '';
        const htState = u.hometown?.state?.toLowerCase() || '';
        const target = options.hometown.toLowerCase();
        if (!htCity.includes(target) && !htState.includes(target)) return false;
      }
      if (options.locality && options.locality !== 'All') {
        const loc = u.currentLocation?.locality || '';
        if (loc !== options.locality) return false;
      }
      if (options.maxDistance && u.distanceFromCurrentUser) {
        if (u.distanceFromCurrentUser > options.maxDistance) return false;
      }
      return true;
    });
  };

  const updateCurrentUserProfile = (data: UpdateProfileRequest) => {
    if (!currentUser) return;
    const updated: User = {
      ...currentUser,
      ...data,
      firstName: data.firstName ?? currentUser.firstName,
      lastName: data.lastName ?? currentUser.lastName,
      fullName: data.firstName || data.lastName ? `${data.firstName || currentUser.firstName} ${data.lastName || currentUser.lastName}` : currentUser.fullName,
      bio: data.bio ?? currentUser.bio,
      profession: data.profession ?? currentUser.profession,
      currentLocation: data.currentLocation ?? currentUser.currentLocation,
      hometown: data.hometown ?? currentUser.hometown,
      motherTongue: data.motherTongue ?? currentUser.motherTongue,
      interests: data.interests ?? currentUser.interests,
      avatar: data.avatar ?? currentUser.avatar,
      updatedAt: new Date().toISOString(),
    };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    localStorage.setItem('user_data', JSON.stringify(updated));
  };

  return (
    <UserContext.Provider
      value={{
        users,
        currentUser,
        setCurrentUser,
        getUserById,
        searchUsers,
        filterUsers,
        updateCurrentUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
