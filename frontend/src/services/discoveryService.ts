import { api } from './api';
import type { User, IndianLocation } from '@/types';

export interface DiscoveryFiltersRequest {
  languages?: string[];
  maxDistance?: number;
  currentLocation?: IndianLocation;
  interests?: string[];
}

export const discoveryService = {
  async discoverNearby(location: { latitude: number; longitude: number }, radiusKm: number = 10): Promise<User[]> {
    const response = await api.get<User[]>('/discovery/nearby', {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        radius: radiusKm,
      },
    });
    return response.data;
  },

  async discoverByLanguage(languageId: string): Promise<User[]> {
    const response = await api.get<User[]>('/discovery/language', {
      params: { languageId },
    });
    return response.data;
  },

  async discoverByHometown(hometown: string): Promise<User[]> {
    const response = await api.get<User[]>('/discovery/hometown', {
      params: { hometown },
    });
    return response.data;
  },

  async discoverWithFilters(filters: DiscoveryFiltersRequest): Promise<User[]> {
    const response = await api.post<User[]>('/discovery/filter', filters);
    return response.data;
  },

  async getRecommendedUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/discovery/recommended');
    return response.data;
  },
};
