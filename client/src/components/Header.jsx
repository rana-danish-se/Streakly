import { Bell, BellOff, Target } from 'lucide-react';
import { useNotificationContext } from '@context/NotificationContext';

export default function Header() {
  const { isSubscribed, permission } = useNotificationContext();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Journey Tracker
              </h1>
              <p className="text-sm text-gray-500">Track your personal goals</p>
            </div>
          </div>

          {/* Notification Status Indicator */}
          <div className="flex items-center gap-2">
            {permission === 'granted' && isSubscribed && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <Bell className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Notifications On
                </span>
              </div>
            )}
            
            {permission === 'granted' && !isSubscribed && (
              <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <BellOff className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">
                  Notifications Paused
                </span>
              </div>
            )}
            
            {permission === 'denied' && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                <BellOff className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">
                  Notifications Blocked
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// WHY THIS COMPONENT?
// - Consistent header across all pages
// - Visual notification status indicator
// - Uses context for real-time status updates
// - Responsive design with Tailwind
// - Clear branding and navigation