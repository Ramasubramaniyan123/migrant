import apiClient from './api/apiClient';

const userService = {
  // Get current user
  getMe: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },
};

export default userService;
