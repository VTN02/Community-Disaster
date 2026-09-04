import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Admin API client
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

// Handle admin auth errors
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

// Dedicated Help Team API client
export const helpTeamClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to help team requests
helpTeamClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('help_team_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle help team auth errors
helpTeamClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('help_team_token');
      localStorage.removeItem('help_team_member');
      if (
        window.location.pathname.startsWith('/help-team') &&
        window.location.pathname !== '/help-team/login' &&
        window.location.pathname !== '/help-team/register'
      ) {
        window.location.href = '/help-team/login';
      }
    }
    return Promise.reject(error);
  }
);

// Admin Auth
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Help Team Auth
export const helpTeamAuthApi = {
  register: (data) => helpTeamClient.post('/help-team/auth/register', data),
  login: (credentials) => helpTeamClient.post('/help-team/auth/login', credentials),
  getMe: () => helpTeamClient.get('/help-team/auth/me'),
  updateAvailability: (data) => helpTeamClient.patch('/help-team/auth/availability', data),
};

// Help Team Tasks & Progression
export const helpTeamTasksApi = {
  getMyTasks: (params) => helpTeamClient.get('/help-team/tasks', { params }),
  getTaskById: (id) => helpTeamClient.get(`/help-team/tasks/${id}`),
  updateStatus: (id, data) => helpTeamClient.patch(`/help-team/tasks/${id}/status`, data),
};

// Teams & Hierarchy
export const teamsApi = {
  getAll: () => api.get('/teams'),
  getOne: (id) => api.get(`/teams/${id}`),
  getSubGroups: (params) => api.get('/teams/subgroups', { params }),
  getHierarchy: () => api.get('/teams/hierarchy'),
};

// Assignments & Dispatch
export const assignmentsApi = {
  getAll: (params) => api.get('/assignments', { params }),
  getStats: () => api.get('/assignments/stats'),
  autoMatch: (incidentId, data) => api.post(`/assignments/auto-match/${incidentId}`, data),
  manualAssign: (data) => api.post('/assignments/manual', data),
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

export default api;
