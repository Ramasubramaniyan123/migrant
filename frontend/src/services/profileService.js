import apiClient from './api/apiClient';

const profileService = {
  // Get compact profile
  getProfile: async () => {
    const response = await apiClient.get('/profile/me');
    return response.data;
  },

  // Get detailed profile
  getProfileDetails: async () => {
    const response = await apiClient.get('/profile/details');
    return response.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await apiClient.put('/profile/me', data);
    return response.data;
  },

  // Update privacy settings
  updatePrivacy: async (settings) => {
    const response = await apiClient.put('/profile/privacy', settings);
    return response.data;
  },

  // Update location
  updateLocation: async (location) => {
    const response = await apiClient.put('/profile/location', location);
    return response.data;
  },

  // Add language
  addLanguage: async (languageId, proficiency = '', primary = false) => {
    const response = await apiClient.post(
      `/profile/languages/${languageId}?proficiency=${proficiency}&primary=${primary}`
    );
    return response.data;
  },

  // Remove language
  removeLanguage: async (languageId) => {
    const response = await apiClient.delete(`/profile/languages/${languageId}`);
    return response.data;
  },

  // Update profile picture
  setProfilePicture: async (imageUrl) => {
    const response = await apiClient.post('/profile/profile-picture', { imageUrl });
    return response.data;
  },

  // Deactivate account
  deactivateAccount: async () => {
    const response = await apiClient.post('/profile/deactivate');
    return response.data;
  },
};

export default profileService;
