import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import profileService from '../services/profileService';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfileDetails();
      setProfile(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [isAuthenticated]);

  const updateProfile = async (data) => {
    try {
      const updated = await profileService.updateProfile(data);
      setProfile(updated);
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const updatePrivacy = async (settings) => {
    try {
      const updated = await profileService.updatePrivacy(settings);
      setProfile(updated);
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const value = {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updatePrivacy,
    setProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
