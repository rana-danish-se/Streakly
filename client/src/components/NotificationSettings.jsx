import { Bell, BellOff, CheckCircle, AlertCircle, TestTube } from 'lucide-react';
import { useNotificationContext } from '@context/NotificationContext';

export default function NotificationSettings() {
  const {
    permission,
    isSubscribed,
    loading,
    error,
    enableNotifications,
    disableNotifications,
    showTestNotification,
    isSupported,
  } = useNotificationContext();

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">
              Notifications Not Supported
            </h3>
            <p className="text-sm text-yellow-700">
              Your browser doesn't support push notifications. Please use a modern browser like Chrome, Firefox, or Edge.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {isSubscribed ? (
            <div className="bg-green-100 p-2.5 rounded-lg">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
          ) : (
            <div className="bg-gray-100 p-2.5 rounded-lg">
              <BellOff className="w-5 h-5 text-gray-600" />
            </div>
          )}
          
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              Push Notifications
            </h3>
            <p className="text-sm text-gray-600">
              {isSubscribed 
                ? 'You will receive journey reminders and updates' 
                : 'Enable to get notified about your journeys'
              }
            </p>
          </div>
        </div>

        {/* Toggle Button */}
        {permission === 'granted' && (
          <button
            onClick={isSubscribed ? disableNotifications : enableNotifications}
            disabled={loading}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50 ${
              isSubscribed
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            {loading ? 'Processing...' : isSubscribed ? 'Disable' : 'Enable'}
          </button>
        )}

        {permission === 'default' && (
          <button
            onClick={enableNotifications}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Requesting...' : 'Enable Notifications'}
          </button>
        )}

        {permission === 'denied' && (
          <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg">
            Blocked
          </span>
        )}
      </div>

      {/* Permission Denied Instructions */}
      {permission === 'denied' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Notifications Are Blocked
          </h4>
          <p className="text-sm text-red-700 mb-3">
            To enable notifications, you need to update your browser settings:
          </p>
          <ol className="text-sm text-red-700 space-y-1 list-decimal list-inside">
            <li>Click the lock icon in your browser's address bar</li>
            <li>Find "Notifications" in the permissions list</li>
            <li>Change the setting to "Allow"</li>
            <li>Reload this page</li>
          </ol>
        </div>
      )}

      {/* Error Message */}
      {error && permission !== 'denied' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {isSubscribed && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 mb-1">
                Notifications Enabled
              </h4>
              <p className="text-sm text-green-700 mb-3">
                You'll receive notifications for:
              </p>
              <ul className="text-sm text-green-700 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  24 hours before your journey starts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  1 hour before your journey starts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  When your journey begins
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Test Notification Button */}
      {isSubscribed && (
        <button
          onClick={showTestNotification}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium"
        >
          <TestTube className="w-4 h-4" />
          Send Test Notification
        </button>
      )}
    </div>
  );
}

// WHY THIS COMPONENT?
// - Complete notification management UI
// - Shows different states: enabled, disabled, blocked, unsupported
// - Clear instructions for unblocking notifications
// - Test button to verify notifications work
// - Success state explains what notifications user will receive
// - Uses context for state management
// - Responsive and accessible design