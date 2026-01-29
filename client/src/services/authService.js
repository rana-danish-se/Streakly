import api from './api';

// Authentication API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    // Backend returns { success: true, data: { user: {...}, token: '...' } }
    return response.data.data || response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    // Backend returns { success: true, data: { user: {...}, token: '...' } }
    return response.data.data || response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    // Backend returns { success: true, data: { user: {...} } }
    return response.data.data || response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/update-profile', userData);
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (formData) => {
    const response = await api.put('/auth/profile-picture', formData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },

  // Google OAuth authentication
  googleAuth: async (idToken, mode) => {
    const response = await api.post('/auth/google', { idToken, mode });
    // Backend returns { success: true, data: { user: {...}, token: '...' } }
    return response.data.data || response.data;
  },
  
  // Verify email with OTP
  verifyEmail: async (email, otp) => {
    const response = await api.post('/auth/verify-email', { email, otp });
    return response.data;
  },

  // Resend OTP
  resendOTP: async (email) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },
};

export default authAPI;
