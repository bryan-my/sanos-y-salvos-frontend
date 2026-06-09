import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/usuarios/registro', userData),
};

export const usuarioService = {
  getLista: () => api.get('/usuarios/lista'),
  eliminar: (id) => api.delete(`/usuarios/${id}`),
};

export const mascotaService = {
  registrar: (mascotaData) => api.post('/mascotas', mascotaData),
  getLista: () => api.get('/mascotas/lista'),
  getByUsuario: (idUsuario) => api.get(`/mascotas/usuario/${idUsuario}`),
  getById: (id) => api.get(`/mascotas/${id}`),
};

export const geolocalizacionService = {
  getMapaPublico: () => api.get('/geolocalizacion/mapa'),
};

export const reportesService = {
  reportarAvistamiento: (data) => api.post('/reportes/avistamiento', data),
  getAvistamientosRecientes: () => api.get('/reportes/recientes'),
};

export default api;
