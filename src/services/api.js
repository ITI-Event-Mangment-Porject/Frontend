import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// List of routes that require authentication
const PROTECTED_ROUTES = [
  '/users',
  '/tracks',
  '/events',
  '/companies',
  '/queue',
  '/auth/logout',
  '/auth/refresh',
  '/auth/me',
  '/notifications',
  '/dashboard',
  '/analytics',
  '/reports',
  '/profile',
];

// Helper function to check if a route requires authentication
const requiresAuth = url => {
  return PROTECTED_ROUTES.some(route => url.includes(route));
};

// Request interceptor to handle FormData and authentication
api.interceptors.request.use(
  config => {
    // Handle FormData
    if (config.data instanceof FormData) {
      // Remove Content-Type header for FormData, let browser set it
      delete config.headers['Content-Type'];
    }

    // Add authentication header for protected routes
    if (requiresAuth(config.url)) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  response => response,
  error => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// User API endpoints
export const userAPI = {
  getAll: params => api.get('/users', { params }),
  getById: id => api.get(`/users/${id}`),
  create: userData => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: id => api.delete(`/users/${id}`),
};

// Track API endpoints
export const trackAPI = {
  getAll: params => api.get('/tracks', { params }),
  getById: id => api.get(`/tracks/${id}`),
  create: trackData => api.post('/tracks', trackData),
  update: (id, trackData) => api.put(`/tracks/${id}`, trackData),
  delete: id => api.delete(`/tracks/${id}`),
};

// Event API endpoints
export const eventAPI = {
  getAll: params => api.get('/events', { params }),
  getById: id => api.get(`/events/${id}`),
  create: eventData => api.post('/events', eventData),
  update: (id, eventData) => api.put(`/events/${id}`, eventData),
  delete: id => api.delete(`/events/${id}`),
};

// Company API endpoints
export const companyAPI = {
  getAll: params => api.get('/companies', { params }),
  getById: id => api.get(`/companies/${id}`),
  create: companyData => api.post('/companies', companyData),
  update: (id, companyData) => api.put(`/companies/${id}`, companyData),
  delete: id => api.delete(`/companies/${id}`),
  // Custom actions for companies
  approve: id => api.post(`/companies/${id}/approve`),
  reject: (id, reason) => api.post(`/companies/${id}/reject`, { reason }),
};

// Authentication API endpoints
export const authAPI = {
  login: credentials => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  me: () => api.get('/auth/me'),
  register: userData => api.post('/auth/register', userData),
  forgotPassword: email => api.post('/auth/forgot-password', { email }),
  resetPassword: data => api.post('/auth/reset-password', data),
};

// Queue API endpoints
export const queueAPI = {
  getStats: params => api.get('/queue/stats', { params }),
  getCurrentWaitTime: () => api.get('/queue/wait-time'),
};

export default api;
