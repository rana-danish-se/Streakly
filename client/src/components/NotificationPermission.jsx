import { useState, useEffect } from 'react';
import { useNotificationContext } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FiBell, FiX } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

const NotificationPermission = () => {
  const { 
    permission, 
    isSubscribed, 
    enableNotifications, 
    loading, 
    isSupported 
  } = useNotificationContext();
  
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissedThisSession, setIsDismissedThisSession] = useState(false);

  useEffect(() => {
    // Show banner after 3 seconds if conditions are met
    // Show if permission is 'default' OR if permission is 'granted' but not subscribed
    const shouldShow = user && 
                       isSupported && 
                       !isSubscribed && 
                       (permission === 'default' || permission === 'granted') && 
                       !isDismissedThisSession;

    if (shouldShow) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [user, isSubscribed, permission, isSupported, isDismissedThisSession]);

  const handleEnable = async () => {
    const success = await enableNotifications();
    if (success) {
      setIsVisible(false);
      setIsDismissedThisSession(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissedThisSession(true);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-6 right-6 z-50 max-w-md w-full mx-4 sm:mx-0"
        style={{
          backgroundColor: 'var(--card)',
          borderRadius: '16px',
          boxShadow: theme === 'dark' 
            ? '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
            : '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Gradient Border Effect */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-50"
          style={{
            background: `linear-gradient(135deg, var(--primary), var(--success))`,
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        <div className="relative p-6">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1 rounded-lg transition-all hover:scale-110"
            style={{ 
              color: 'var(--text)',
              opacity: 0.6,
            }}
          >
            <FiX size={20} />
          </button>

          <div className="flex items-start gap-4">
            {/* Icon */}
            <motion.div 
              className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, var(--primary), var(--success))`,
                color: '#FFFFFF'
              }}
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <FiBell size={28} />
            </motion.div>

            {/* Content */}
            <div className="flex-1 pr-6">
              <h3 
                className="text-lg font-bold mb-1"
                style={{ color: 'var(--text)' }}
              >
                Stay on Track! 🎯
              </h3>
              <p 
                className="text-sm mb-4 opacity-70"
                style={{ color: 'var(--text)' }}
              >
                Get timely reminders when your journeys start and daily notifications to maintain your streak!
              </p>
              
              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all hover:scale-105"
                  style={{ 
                    color: 'var(--text)',
                    opacity: 0.7,
                  }}
                >
                  Maybe Later
                </button>
                <motion.button
                  onClick={handleEnable}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
                  style={{ 
                    background: `linear-gradient(135deg, var(--primary), var(--success))`,
                    color: '#FFFFFF',
                    boxShadow: theme === 'dark'
                      ? '0 4px 20px rgba(74, 222, 128, 0.3)'
                      : '0 4px 20px rgba(34, 197, 94, 0.3)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enabling...
                    </>
                  ) : (
                    <>
                      <FiBell size={16} />
                      Enable Notifications
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Bar */}
        <div 
          className="h-1.5 rounded-b-2xl"
          style={{
            background: `linear-gradient(90deg, var(--primary), var(--success))`
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationPermission;
