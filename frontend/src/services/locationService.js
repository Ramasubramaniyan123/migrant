import apiClient from './api/apiClient';

const locationService = {
  // Get nearby location
  getNearbyLocation: async () => {
    const response = await apiClient.get('/locations/nearby');
    return response.data;
  },
};

export default locationService;
