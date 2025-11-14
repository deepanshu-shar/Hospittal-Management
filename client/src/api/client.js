import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000
});

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('hms_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.localStorage.removeItem('hms_access_token');
      window.localStorage.removeItem('hms_user');
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export { apiClient };
