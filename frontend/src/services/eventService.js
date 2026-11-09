import apiClient from './api/apiClient';

const eventService = {
  // Get upcoming events
  getEvents: async (communityId = null, page = 0, size = 20) => {
    const params = new URLSearchParams({ page, size });
    if (communityId) params.append('communityId', communityId);
    
    const response = await apiClient.get(`/events?${params.toString()}`);
    return response.data;
  },

  // Get my events
  getMyEvents: async (page = 0, size = 20) => {
    const params = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/events/mine?${params.toString()}`);
    return response.data;
  },

  // Get event details
  getEventDetails: async (id) => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },

  // Create event
  createEvent: async (data) => {
    const response = await apiClient.post('/events', data);
    return response.data;
  },

  // Update event
  updateEvent: async (id, data) => {
    const response = await apiClient.put(`/events/${id}`, data);
    return response.data;
  },

  // Cancel event
  cancelEvent: async (id) => {
    const response = await apiClient.post(`/events/${id}/cancel`);
    return response.data;
  },

  // Register for event
  registerForEvent: async (id) => {
    const response = await apiClient.post(`/events/${id}/register`);
    return response.data;
  },

  // Cancel registration
  cancelRegistration: async (id) => {
    const response = await apiClient.delete(`/events/${id}/register`);
    return response.data;
  },

  // Get participants
  getParticipants: async (id, page = 0, size = 50) => {
    const params = new URLSearchParams({ page, size });
    const response = await apiClient.get(`/events/${id}/participants?${params.toString()}`);
    return response.data;
  },
};

export default eventService;
