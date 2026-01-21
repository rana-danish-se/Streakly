import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useNotificationContext } from '@context/NotificationContext';

export default function NotificationBanner() {
  const { permission, enableNotifications, loading, error } = useNotificationContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner after 2 seconds if permission not granted
    const hasSeenBanner = localStorage.getItem('notificationBannerSeen');
    
    if (permission === 'default' && !hasSeenBanner) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [permission]);

  const handleEnable = async () => {
    const success = await enableNotifications();
    if (success) {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('notificationBannerSeen', 'true');
  };

  if (!visible || permission !== 'default') {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-full mx-4 animate-slide-down">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full flex-shrink-0">
            <Bell className="w-6 h-6" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">
              Never Miss Your Journey
            </h3>
            <p className="text-sm text-white/90 mb-4">
              Get timely reminders when your journeys start. We'll notify you 24 hours and 1 hour before, plus when it's time to begin.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleEnable}
                disabled={loading}
                className="flex-1 bg-white text-blue-600 px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                {loading ? 'Enabling...' : 'Enable Notifications'}
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Not Now
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <p className="mt-3 text-sm text-red-200 bg-red-900/30 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="text-white/70 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// WHY THIS COMPONENT?
// - Non-intrusive: Appears after 2 seconds, user can dismiss
// - Context integration: Uses global notification state
// - localStorage: Remembers if user dismissed (won't annoy them)
// - Gradient design: Eye-catching but professional
// - Responsive: Works on mobile and desktop
// - Clear value prop: Explains benefits of notifications