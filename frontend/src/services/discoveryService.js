import apiClient from './api/apiClient';

const discoveryService = {
  // Get suggestions with filters
  getSuggestions: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.radiusKm) params.append('radiusKm', filters.radiusKm);
    if (filters.latitude) params.append('latitude', filters.latitude);
    if (filters.longitude) params.append('longitude', filters.longitude);
    if (filters.hometownCity) params.append('hometownCity', filters.hometownCity);
    if (filters.currentCity) params.append('currentCity', filters.currentCity);
    if (filters.languageId) params.append('languageId', filters.languageId);
    if (filters.interest) params.append('interest', filters.interest);
    
    params.append('page', filters.page || 0);
    params.append('size', filters.size || 20);

    const response = await apiClient.get(`/discovery/suggestions?${params.toString()}`);
    return response.data;
  },

  // Discover people from hometown
  discoverHometown: async (hometownCity, page = 0, size = 20) => {
    const params = new URLSearchParams({
      page,
      size,
    });
    
    if (hometownCity) {
      params.append('hometownCity', hometownCity);
    }

    const response = await apiClient.get(`/discovery/hometown?${params.toString()}`);
    return response.data;
  },
};

export default discoveryService;
