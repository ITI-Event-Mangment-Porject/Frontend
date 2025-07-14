import axios from 'axios';

const APP_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: `${APP_URL}/api`,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
