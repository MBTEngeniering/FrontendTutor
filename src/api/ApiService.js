const apiUrl = import.meta.env.VITE_API_URL;

import axios from 'axios';

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // Automatically send cookies
  timeout: 10000,
});

const ApiService = {
  get: (url, params) => api.get(url, { params }),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  delete: (url) => api.delete(url),
};



/*
// Response interceptor for token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Auto-refresh token on 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      await refreshToken(); // Call refreshToken() from earlier example
      return api(originalRequest); // Retry original request
    }

    return Promise.reject(error);
  }
);

 */

export default ApiService;
