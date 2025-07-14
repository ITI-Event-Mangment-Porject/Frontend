import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : 'http://localhost:8000/api',

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
  '/job-fairs',
  '/auth/logout',
  '/auth/refresh',
  '/auth/me',
  '/notifications',
  '/message/bulk-messages', // Add this line for bulk message endpoints
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
     // const token='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDEvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3NTI0MTg3NTksImV4cCI6MjA1MjQxODc1OSwibmJmIjoxNzUyNDE4NzU5LCJqdGkiOiJpRU9rU3QxTlpub01mdzVZIiwic3ViIjoiMTY5IiwicHJ2IjoiMTNlOGQwMjhiMzkxZjNiN2I2M2YyMTkzM2RiYWQ0NThmZjIxMDcyZSJ9.m2mEUN9XPj7ogX-b-S05E2-oZ2ky7tMHC5lLoXq7Mfo';
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

// // Response interceptor to handle authentication errors
// api.interceptors.response.use(
//   response => response,
//   error => {
//     // Handle authentication errors
//     if (error.response?.status === 401) {
//       console.warn('401 Unauthorized response received', error.config?.url);

//       // Check if we're already on a public route
//       const publicRoutes = [
//         '/login',
//         '/register',
//         '/forgot-password',
//         '/reset-password',
//         '/home',
//       ];
//       const isOnPublicRoute = publicRoutes.some(route =>
//         window.location.pathname.includes(route)
//       );

//       // Clear invalid token
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');

//       // Redirect to login page if not already on a public route
//       if (!isOnPublicRoute) {
//         console.log('Redirecting to login due to authentication error');
//         window.location.href = '/';
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// User API endpoints
export const userAPI = {
  getAll: params => api.get('/users', { params }),
  getById: id => api.get(`/users/${id}`),
  create: userData => api.post('/users', userData),
  update: (id, userData) => api.post(`/users/${id}`, userData),
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
  publish: id => {
    console.log('eventAPI.publish - Token:', localStorage.getItem('token'));
    console.log('eventAPI.publish - Event ID:', id);
    return api.get(`/events/${id}/publish`);
  },
  archive: id => {
    console.log('eventAPI.archive - Token:', localStorage.getItem('token'));
    console.log('eventAPI.archive - Event ID:', id);
    return api.get(`/events/${id}/archive`);
  },
};

// Company API endpoints
export const companyAPI = {
  getAll: params => api.get('/companies', { params }),
  getById: id => api.get(`/companies/${id}`),
  create: async (formData) => {
    const token = localStorage.getItem('token');
    return api.post('/companies', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  }
  
 ,
  update: (id, companyData) => api.put(`/companies/${id}`, companyData),
  delete: id => api.delete(`/companies/${id}`),
  // Custom actions for companies
  approve: id => {
    console.log('companyAPI.approve - Token:', localStorage.getItem('token'));
    console.log('companyAPI.approve - Company ID:', id);
    return api.post(`/companies/${id}/approve`);
  },
  reject: (id, reason) => {
    console.log('companyAPI.reject - Token:', localStorage.getItem('token'));
    console.log('companyAPI.reject - Company ID:', id, 'Reason:', reason);
    const requestData = reason ? { reason } : {};
    return api.post(`/companies/${id}/reject`, requestData);
  },
  pending: id => {
    console.log('companyAPI.pending - Token:', localStorage.getItem('token'));
    console.log('companyAPI.pending - Company ID:', id);
    return api.post(`/companies/${id}/pending`);
  },
};

export const messageAPI = {
  getAll: params => {
    console.log('messageAPI.getAll - Token:', localStorage.getItem('token'));
    return api.get('/message/bulk-messages', { params });
  },
  getAllMessages: params => {
    console.log(
      'messageAPI.getAllMessages - Token:',
      localStorage.getItem('token')
    );
    return api.get('/message/bulk-messages', { params });
  },
  getStats: () => {
    console.log('messageAPI.getStats - Token:', localStorage.getItem('token'));
    return api.get('/message/bulk-messages/stats').catch(() => {
      // If stats endpoint doesn't exist, return null
      return null;
    });
  },
  getById: id => {
    console.log('messageAPI.getById - Token:', localStorage.getItem('token'));
    return api.get(`/message/bulk-messages/${id}`);
  },
  create: messageData => {
    console.log('messageAPI.create - Token:', localStorage.getItem('token'));
    console.log('messageAPI.create - Data:', messageData);
    return api.post('/message/bulk-messages', messageData);
  },
  sendBulkMessages: messageData => {
    console.log(
      'messageAPI.sendBulkMessages - Token:',
      localStorage.getItem('token')
    );
    return api.post('/message/bulk-messages', messageData);
  }, // Keep for backward compatibility
  sendMessage: id => {
    console.log(
      'messageAPI.sendMessage - Token:',
      localStorage.getItem('token')
    );
    console.log('messageAPI.sendMessage - ID:', id);
    return api.post(`/message/bulk-messages/${id}/send`);
  },
  getStatus: id => {
    console.log('messageAPI.getStatus - Token:', localStorage.getItem('token'));
    console.log('messageAPI.getStatus - ID:', id);
    return api.get(`/message/bulk-messages/${id}/status`);
  },
};

// Job Fair Participation API endpoints
export const jobFairAPI = {
  getParticipations: jobFairId => {
    if (!jobFairId) {
      console.error('Missing jobFairId in getParticipations call');
      return Promise.reject(new Error('Job Fair ID is required'));
    }

    // Log token for debugging
    const token = localStorage.getItem('token');
    console.log(`Token available for job fair request: ${!!token}`);

    return api.get(`/job-fairs/${jobFairId}/participations`).catch(error => {
      console.error(
        'Error fetching job fair participations:',
        error.response?.status,
        error.response?.data
      );
      if (error.response?.status === 401) {
        console.warn(
          'Authentication error when fetching job fair participations. Check your login status and token validity.'
        );
      }
      return Promise.reject(error);
    });
  },
  getCompanyQueue: (eventId, companyId) => {
    if (!eventId || !companyId) {
      console.error('Missing eventId or companyId in getCompanyQueue call');
      return Promise.reject(new Error('Event ID and Company ID are required'));
    }

    return api
      .get(`/job-fairs/${eventId}/queues/company/${companyId}`)
      .catch(error => {
        console.error(
          'Error fetching company queue:',
          error.response?.status,
          error.response?.data
        );
        return Promise.reject(error);
      });
  },
  getParticipationsWithFallback: jobFairId => {
    if (!jobFairId) {
      console.error('Missing jobFairId in getParticipationsWithFallback call');
      return Promise.reject(new Error('Job Fair ID is required'));
    }

    return api.get(`/job-fairs/${jobFairId}/participations`).catch(error => {
      console.warn(
        'Using fallback data for job fair participations due to API error:',
        error.message
      );

      // Return mock data for development/testing purposes
      return {
        data: {
          success: true,
          data: {
            result: [
              // Sample participation data
              {
                id: 1,
                event_id: 1,
                company_id: 1,
                status: 'approved',
                created_at: '2025-06-02T20:36:06.000000Z',
                company: {
                  id: 1,
                  name: 'TechCorp Solutions',
                  industry: 'Technology',
                },
              },
              {
                id: 2,
                event_id: 1,
                company_id: 2,
                status: 'pending',
                created_at: '2025-07-02T20:36:07.000000Z',
                company: {
                  id: 2,
                  name: 'DataVision Analytics',
                  industry: 'Technology',
                },
              },
            ],
          },
          message: 'Fallback participations data loaded.',
        },
      };
    });
  },
  getAllParticipations: async eventIds => {
    // If eventIds is not provided, we'll use a default of [1]
    // Ideally this should be replaced with a call to get all event IDs first
    const ids = eventIds || [1];

    try {
      // Make parallel requests for all event IDs
      const requests = ids.map(id =>
        api.get(`/job-fairs/${id}/participations`)
      );
      const responses = await Promise.all(requests);

      // Combine all results into a single result array
      const allParticipations = responses.reduce((combined, response) => {
        const participations = response.data.data.result || [];
        return [...combined, ...participations];
      }, []);

      return {
        data: {
          success: true,
          data: {
            result: allParticipations,
          },
          message: 'All participations retrieved successfully.',
        },
      };
    } catch (error) {
      console.error('Error fetching all job fair participations:', error);

      // Return a fallback result with empty data
      return {
        data: {
          success: false,
          data: {
            result: [],
          },
          message: 'Failed to retrieve participations.',
        },
      };
    }
  },

  getAllParticipationsWithFallback: async eventIds => {
    try {
      // Try to get all participations
      return await jobFairAPI.getAllParticipations(eventIds);
    } catch (error) {
      console.warn(
        'Using fallback data for all job fair participations due to API error:',
        error.message
      );

      // Return mock data for development/testing purposes
      return {
        data: {
          success: true,
          data: {
            result: [
              // Event 1 participations
              {
                id: 1,
                event_id: 1,
                company_id: 1,
                status: 'approved',
                created_at: '2025-06-02T20:36:06.000000Z',
                company: {
                  id: 1,
                  name: 'TechCorp Solutions',
                  industry: 'Technology',
                },
              },
              {
                id: 2,
                event_id: 1,
                company_id: 2,
                status: 'pending',
                created_at: '2025-07-02T20:36:07.000000Z',
                company: {
                  id: 2,
                  name: 'DataVision Analytics',
                  industry: 'Technology',
                },
              },
              // Event 2 participations
              {
                id: 3,
                event_id: 2,
                company_id: 3,
                status: 'approved',
                created_at: '2025-06-15T10:30:00.000000Z',
                company: {
                  id: 3,
                  name: 'SecureNet Systems',
                  industry: 'Cybersecurity',
                },
              },
              {
                id: 4,
                event_id: 2,
                company_id: 4,
                status: 'approved',
                created_at: '2025-06-18T14:22:30.000000Z',
                company: {
                  id: 4,
                  name: 'CreativeDesign Studio',
                  industry: 'Design',
                },
              },
              // Event 3 participations
              {
                id: 5,
                event_id: 3,
                company_id: 5,
                status: 'approved',
                created_at: '2025-05-10T09:15:00.000000Z',
                company: {
                  id: 5,
                  name: 'Global Finance Corp',
                  industry: 'Finance',
                },
              },
              {
                id: 6,
                event_id: 3,
                company_id: 6,
                status: 'pending',
                created_at: '2025-05-12T11:45:00.000000Z',
                company: {
                  id: 6,
                  name: 'CloudTech Solutions',
                  industry: 'Cloud Computing',
                },
              },
            ],
          },
          message: 'Fallback participations data loaded for all events.',
        },
      };
    }
  },

  // Job Fair Setup specific endpoints
  getParticipationDetails: (jobFairId, participationId) => {
    if (!jobFairId || !participationId) {
      console.error(
        'Missing jobFairId or participationId in getParticipationDetails call'
      );
      return Promise.reject(
        new Error('Job Fair ID and Participation ID are required')
      );
    }

    console.log(
      'jobFairAPI.getParticipationDetails - Token:',
      localStorage.getItem('token')
    );
    console.log(
      'jobFairAPI.getParticipationDetails - Job Fair ID:',
      jobFairId,
      'Participation ID:',
      participationId
    );

    return api
      .get(`/job-fairs/${jobFairId}/participations/${participationId}`)
      .catch(error => {
        console.error(
          'Error fetching participation details:',
          error.response?.status,
          error.response?.data
        );
        return Promise.reject(error);
      });
  },

  updateParticipationStatus: (jobFairId, participationId, status) => {
    if (!jobFairId || !participationId || !status) {
      console.error(
        'Missing required parameters in updateParticipationStatus call'
      );
      return Promise.reject(
        new Error('Job Fair ID, Participation ID, and status are required')
      );
    }

    console.log(
      'jobFairAPI.updateParticipationStatus - Token:',
      localStorage.getItem('token')
    );
    console.log(
      'jobFairAPI.updateParticipationStatus - Job Fair ID:',
      jobFairId,
      'Participation ID:',
      participationId,
      'Status:',
      status
    );

    return api
      .put(`/job-fairs/${jobFairId}/participations/${participationId}`, {
        status,
      })
      .catch(error => {
        console.error(
          'Error updating participation status:',
          error.response?.status,
          error.response?.data
        );
        return Promise.reject(error);
      });
  },

  createJobFair: jobFairData => {
    const token=localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return Promise.reject(new Error('Authentication token missing'));
    }
  
    return api.post('/job-fairs', jobFairData, {
      headers: {
        Authorization: `Bearer ${token}`,
        
      },
    }).catch(error => {
      console.error(
        'Error creating job fair:',
        error.response?.status,
        error.response?.data
      );
      return Promise.reject(error);
    });
  },
  
};

// Attendance API endpoints
export const attendanceAPI = {
  
  getReports: () => {
    console.log(
      'attendanceAPI.getReports - Token:',
      localStorage.getItem('token')
    );
    return api.get('/reports/attendance');
  },

  getEventAttendance: eventId => {
    console.log(
      'attendanceAPI.getEventAttendance - Token:',
      localStorage.getItem('token')
    );
    console.log('attendanceAPI.getEventAttendance - Event ID:', eventId);
    return api.get(`/reports/attendance/${eventId}`);
  },

  exportAttendance: (format = 'xlsx', eventId = null) => {
    console.log(
      'attendanceAPI.exportAttendance - Token:',
      localStorage.getItem('token')
    );
    console.log(
      'attendanceAPI.exportAttendance - Format:',
      format,
      'Event ID:',
      eventId
    );

    const params = { type: format, report: 'attendance' };
    if (eventId) {
      params.event_id = eventId;
    }

    return api.get('/reports/export', {
      params,
      responseType: 'blob', // Important for file downloads
    });
  },

  getAttendanceStats: () => {
    console.log(
      'attendanceAPI.getAttendanceStats - Token:',
      localStorage.getItem('token')
    );
    return api.get('/reports/attendance/stats').catch(() => {
      // If stats endpoint doesn't exist, return null
      return null;
    });
  },
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
