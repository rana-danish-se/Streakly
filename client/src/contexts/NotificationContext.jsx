import { createContext, useContext, useState, useEffect } from 'react';
import pushService from '../services/pushNotificationService';
const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    try {
      const currentPermission = pushService.getPermission();
      setPermission(currentPermission);
      
      if (currentPermission === 'granted') {
        const subscription = await pushService.getSubscription();
        setIsSubscribed(!!subscription);
      } else {
        setIsSubscribed(false);
      }
    } catch (err) {
      console.error('Failed to check notification status:', err);
    }
  };

  const enableNotifications = async () => {
    setLoading(true);
    setError(null);

    try {
      await pushService.setupPushNotifications();
      setPermission('granted');
      setIsSubscribed(true);
      return true;
    } catch (err) {
      setError(err.message);
      if (err.message.includes('denied')) {
        setPermission('denied');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const disableNotifications = async () => {
    setLoading(true);
    setError(null);

    try {
      await pushService.unsubscribe();
      setIsSubscribed(false);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const showTestNotification = async () => {
    try {
      await pushService.showTestNotification();
    } catch {
      setError('Failed to show test notification');
    }
  };

  const value = {
    permission,
    isSubscribed,
    loading,
    error,
    enableNotifications,
    disableNotifications,
    showTestNotification,
    isSupported: pushService.isSupported(),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};