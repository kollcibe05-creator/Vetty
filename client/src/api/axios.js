import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5555',
  withCredentials: true, // Crucial for session cookies
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default api;