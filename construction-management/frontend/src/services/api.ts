import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),
};

// Project APIs
export const projectAPI = {
  getAll: (params?: any) => api.get('/projects', { params }),
  getOne: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/projects/${id}/status`, { status }),
  getStats: (id: string) => api.get(`/projects/${id}/stats`),
  uploadDocument: (id: string, documentType: string, file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    return api.post(`/projects/${id}/upload/${documentType}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Phase APIs
export const phaseAPI = {
  getByProject: (projectId: string) => api.get(`/phases/project/${projectId}`),
  getOne: (id: string) => api.get(`/phases/${id}`),
  create: (data: any) => api.post('/phases', data),
  update: (id: string, data: any) => api.put(`/phases/${id}`, data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/phases/${id}/status`, { status }),
  addCubeTest: (id: string, data: any, file?: File) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (file) formData.append('report', file);
    return api.post(`/phases/${id}/cube-test`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  addInspection: (id: string, data: any, file?: File) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (file) formData.append('report', file);
    return api.post(`/phases/${id}/inspection`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadPhotos: (id: string, files: File[], caption?: string) => {
    const formData = new FormData();
    files.forEach(file => formData.append('photos', file));
    if (caption) formData.append('caption', caption);
    return api.post(`/phases/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getTimeline: (projectId: string) => api.get(`/phases/project/${projectId}/timeline`),
};

// BOQ APIs
export const boqAPI = {
  getByProject: (projectId: string, params?: any) =>
    api.get(`/boq/project/${projectId}`, { params }),
  getOne: (id: string) => api.get(`/boq/${id}`),
  create: (data: any) => api.post('/boq', data),
  update: (id: string, data: any) => api.put(`/boq/${id}`, data),
  updateQuantities: (id: string, data: any) =>
    api.patch(`/boq/${id}/quantities`, data),
  delete: (id: string) => api.delete(`/boq/${id}`),
  getSummary: (projectId: string) => api.get(`/boq/project/${projectId}/summary`),
};

// Payment APIs
export const paymentAPI = {
  getByProject: (projectId: string, params?: any) =>
    api.get(`/payments/project/${projectId}`, { params }),
  getOne: (id: string) => api.get(`/payments/${id}`),
  create: (data: any, file?: File) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (file) formData.append('receipt', file);
    return api.post('/payments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id: string, data: any, file?: File) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (file) formData.append('receipt', file);
    return api.put(`/payments/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  approve: (id: string) => api.patch(`/payments/${id}/approve`),
  markPaid: (id: string, referenceNumber?: string) =>
    api.patch(`/payments/${id}/paid`, { referenceNumber }),
  delete: (id: string) => api.delete(`/payments/${id}`),
  getSummary: (projectId: string) => api.get(`/payments/project/${projectId}/summary`),
};

// User APIs
export const userAPI = {
  getAll: () => api.get('/users'),
  getOne: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  assignProjects: (id: string, projectIds: string[]) =>
    api.post(`/users/${id}/assign-projects`, { projectIds }),
  toggleStatus: (id: string) => api.patch(`/users/${id}/toggle-status`),
  delete: (id: string) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/stats/overview'),
};

// Report APIs
export const reportAPI = {
  getProjectOverview: (projectId: string) =>
    api.get(`/reports/project/${projectId}/overview`),
  getProgressReport: (projectId: string, params?: any) =>
    api.get(`/reports/project/${projectId}/progress`, { params }),
  getFinancialReport: (projectId: string, params?: any) =>
    api.get(`/reports/project/${projectId}/financial`, { params }),
  getQualityReport: (projectId: string) =>
    api.get(`/reports/project/${projectId}/quality`),
  exportData: (projectId: string, format?: string) =>
    api.get(`/reports/project/${projectId}/export`, { params: { format } }),
};

export default api;