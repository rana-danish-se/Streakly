import { useState, useEffect } from 'react';
import { useNotificationContext } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { FiBell, FiBellOff, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationPermission = () => {
  const { 
    permission, 
    isSubscribed, 
    enableNotifications, 
    loading, 
    isSupported 
  } = useNotificationContext();
  
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (user && isSupported && (!isSubscribed || permission === 'default')) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000); 
      return () => clearTimeout(timer);
    } else if (isVisible) {
      const timer = setTimeout(() => setIsVisible(false), 0);
      return () => clearTimeout(timer);
    }
  }, [user, isSubscribed, permission, isSupported, isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
              <FiBell size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
                Enable Notifications
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Get notified when your journeys start and receive daily reminders to keep your streak alive!
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsVisible(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={enableNotifications}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Enable Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress bar or decorative element */}
        <div className="h-1 bg-gradient-to-r from-blue-500 to-teal-400 w-full" />
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationPermission;
