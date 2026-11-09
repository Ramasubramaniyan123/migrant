import apiClient from './api/apiClient';

const languageService = {
  // Get all languages
  getLanguages: async () => {
    const response = await apiClient.get('/languages/list');
    return response.data;
  },
};

export default languageService;
