import apiClient from './api/apiClient';

const uploadService = {
  // Upload file
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get file URL
  getFileUrl: (filename) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/v1', '');
    return `${baseUrl}/v1/uploads/files/${filename}`;
  },
};

export default uploadService;
