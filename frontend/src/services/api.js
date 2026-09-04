import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_data');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Reports
export const reportsApi = {
  getAll: (params) => api.get('/reports', { params }),
  getOne: (id) => api.get(`/reports/${id}`),
  create: (data) => api.post('/reports', data),
  update: (id, data) => api.put(`/reports/${id}`, data),
  delete: (id) => api.delete(`/reports/${id}`),
  updateStatus: (id, data) => api.patch(`/reports/${id}/status`, data),
  verify: (id, data) => api.patch(`/reports/${id}/verify`, data),
  getStats: () => api.get('/reports/stats'),
};

// Emergency contacts
export const emergencyApi = {
  getAll: () => api.get('/emergency-contacts'),
  getAllAdmin: () => api.get('/emergency-contacts/all'),
  create: (data) => api.post('/emergency-contacts', data),
  update: (id, data) => api.put(`/emergency-contacts/${id}`, data),
  delete: (id) => api.delete(`/emergency-contacts/${id}`),
};

// Chatbot Assistant
export const chatApi = {
  sendMessage: (message) => api.post('/chat', { message }),
};

export default api;
