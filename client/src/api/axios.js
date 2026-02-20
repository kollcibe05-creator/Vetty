

import axios from 'axios';

// DETERMINE THE BASE URL
const isProduction = import.meta.env.PROD;

// const LOCAL_API_URL = 'https://your-ngrok-id.ngrok-free.app'; 

const api = axios.create({
  baseURL: isProduction 
    ? 'https://vetty-siuq.onrender.com' 
    : '/api',                  
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', 
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;