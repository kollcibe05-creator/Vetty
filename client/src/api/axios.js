// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://127.0.0.1:5555',
//   withCredentials: true, 
//   headers: {
//     'Content-Type': 'application/json',
//     'ngrok-skip-browser-warning': 'true',
//   },
// });

// // REQUEST INTERCEPTOR: Automatically adds the token to every request
// api.interceptors.request.use(
//   (config) => {
//     // We try to get the token from localStorage (common in Vite/React apps)
//     const token = localStorage.getItem('token'); 
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );


// export default api;

import axios from 'axios';

// 1. DETERMINE THE BASE URL
const isProduction = import.meta.env.PROD;

// If you are using ngrok locally, put the ngrok URL here. 
// Otherwise, keep it empty '' to use the Vite proxy (127.0.0.1:5555).
// const LOCAL_API_URL = 'https://your-ngrok-id.ngrok-free.app'; 

const api = axios.create({
  baseURL: isProduction 
    ? 'https://vetty-siuq.onrender.com' // Render URL
    : '/api',                   // ngrok or empty for proxy
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    // This header only matters for ngrok; Render will ignore it.
    'ngrok-skip-browser-warning': 'true', 
  },
});

// 2. TOKEN INTERCEPTOR (Keep this as you had it)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;