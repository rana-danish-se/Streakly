import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      return Promise.reject({ message, status: error.response.status });
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({ message: 'Network error. Please check your connection.', status: 0 });
    } else {
      // Something else happened
      return Promise.reject({ message: error.message, status: 0 });
    }
  }
);

// Push notification API endpoints
export const pushAPI = {
  // Get VAPID public key
  getPublicKey: () => api.get('/push/vapid-public-key'),
  
  // Subscribe to push notifications
  subscribe: (subscription) => api.post('/push/subscribe', subscription),
  
  // Unsubscribe from push notifications
  unsubscribe: (endpoint) => api.post('/push/unsubscribe', { endpoint }),
  
  // Get user's subscriptions
  getSubscriptions: () => api.get('/push/my-subscriptions'),
};
export default api;
