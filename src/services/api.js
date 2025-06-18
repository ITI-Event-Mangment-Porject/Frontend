import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to handle FormData
api.interceptors.request.use(config => {
  if (config.data instanceof FormData) {
    // Remove Content-Type header for FormData, let browser set it
    delete config.headers['Content-Type'];
  }
  return config;
});

// User API endpoints
export const userAPI = {
  getAll: params => api.get('/test/users', { params }),
  getById: id => api.get(`/test/users/${id}`),
  create: userData => api.post('/test/users', userData),
  update: (id, userData) => api.put(`/test/users/${id}`, userData),
  delete: id => api.delete(`/test/users/${id}`),
};

// Track API endpoints
export const trackAPI = {
  getAll: params => api.get('/test/tracks', { params }),
  getById: id => api.get(`/test/tracks/${id}`),
  create: trackData => api.post('/test/tracks', trackData),
  update: (id, trackData) => api.put(`/test/tracks/${id}`, trackData),
  delete: id => api.delete(`/test/tracks/${id}`),
};

export default api;
