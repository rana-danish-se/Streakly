import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const data = await authAPI.getMe();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const data = await authAPI.register(userData);
      const token = data.token || (data.data && data.data.token);
      const user = data.user || (data.data && data.data.user);
      if (token && user && user.isVerified) {
        localStorage.setItem('token', token);
        setUser(user);
      }
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const data = await authAPI.login(credentials);
      
      const token = data.token || (data.data && data.data.token);
      if (token) localStorage.setItem('token', token);
      
      if (data.user) {
        setUser(data.user);
      } else if (data.data && data.data.user) {
        setUser(data.data.user);
      }
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const data = await authAPI.updateProfile(userData);
      setUser(data.user);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const uploadProfilePicture = async (formData) => {
    try {
      setError(null);
      const data = await authAPI.uploadProfilePicture(formData);
      setUser(prev => ({ ...prev, profilePicture: data.data.profilePicture }));
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setError(null);
      const data = await authAPI.changePassword(passwordData);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const googleLogin = async (idToken, mode) => {
    try {
      setError(null);
      const data = await authAPI.googleAuth(idToken, mode);
      
      const token = data.token || (data.data && data.data.token);
      if (token) localStorage.setItem('token', token);

      if (data.user) {
        setUser(data.user);
      } else if (data.data && data.data.user) {
        setUser(data.data.user);
      }
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      setError(null);
      const data = await authAPI.verifyEmail(email, otp);
      const token = data.token || (data.data && data.data.token);
      if (token) localStorage.setItem('token', token);
      
      if (data.user) {
        setUser(data.user);
      } else if (data.data && data.data.user) {
        setUser(data.data.user);
      }
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const resendOTP = async (email) => {
    try {
      setError(null);
      const data = await authAPI.resendOTP(email);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      const data = await authAPI.forgotPassword(email);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setError(null);
      const data = await authAPI.resetPassword(token, password);
      
      const authtoken = data.token || (data.data && data.data.token);
      if (authtoken) localStorage.setItem('token', authtoken);
       
      if (data.user) {
        setUser(data.user);
      } else if (data.data && data.data.user) {
        setUser(data.data.user);
      }
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    uploadProfilePicture,
    changePassword,
    googleLogin,
    verifyEmail,
    resendOTP,
    forgotPassword,
    resetPassword,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
