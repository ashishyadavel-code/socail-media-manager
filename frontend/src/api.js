import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post('/users/login/', { username, password });
  if (response.data.access) {
    localStorage.setItem('token', response.data.access);
  }
  return response.data;
};

export const register = async (username, email, password) => {
  return await api.post('/users/register/', { username, email, password });
};

export const adminLogin = async (username, password) => {
  const response = await api.post('/admin/login/', { username, password });
  if (response.data.access) {
    localStorage.setItem('admin_token', response.data.access);
  }
  return response.data;
};

export const adminRegister = async (username, email, password) => {
  const response = await api.post('/admin/register/', { username, email, password });
  if (response.data.access) {
    localStorage.setItem('admin_token', response.data.access);
  }
  return response.data;
};

export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `http://localhost:8000${path.startsWith('/') ? '' : '/'}${path}`;
};
