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

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const data = await authAPI.getMe();
      setUser(data.user);
    } catch (err) {
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
      if (token) localStorage.setItem('token', token);
      setUser(data.user || (data.data && data.data.user));
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
      // The backend returns { success: true, user: {...}, token: '...' }
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

  const googleLogin = async (idToken) => {
    try {
      setError(null);
      const data = await authAPI.googleAuth(idToken);
      // The backend returns { success: true, user: {...}, token: '...' }
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

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    googleLogin,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
