import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5555',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// REQUEST INTERCEPTOR: Automatically adds the token to every request
api.interceptors.request.use(
  (config) => {
    // We try to get the token from localStorage (common in Vite/React apps)
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

export default api;