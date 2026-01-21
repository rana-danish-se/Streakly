import { useState } from 'react';
import { Calendar, Clock, Target, Bell, Plus } from 'lucide-react';
import { journeyAPI } from '@services/api';
import { useNotificationContext } from '@context/NotificationContext';

export default function JourneyForm({ onJourneyCreated }) {
  const { permission, enableNotifications } = useNotificationContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDays: 30,
    startDate: '',
    startTime: '09:00',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMinTime = () => {
    if (formData.startDate === getMinDate()) {
      const now = new Date();
      return now.toTimeString().slice(0, 5);
    }
    return '00:00';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const getNotificationSchedule = () => {
    if (!formData.startDate) return null;

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const now = new Date();
    const hoursUntilStart = Math.floor((startDateTime - now) / (1000 * 60 * 60));

    if (hoursUntilStart <= 0) {
      return 'Journey will start immediately';
    } else if (hoursUntilStart <= 1) {
      return 'Notification when journey starts';
    } else if (hoursUntilStart <= 24) {
      return '1 hour reminder + start notification';
    } else {
      return '24 hour reminder + 1 hour reminder + start notification';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }

      if (!formData.startDate) {
        throw new Error('Start date is required');
      }

      // Combine date and time
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);

      // Check if date is in the past
      if (startDateTime < new Date()) {
        throw new Error('Start date cannot be in the past');
      }

      // Create journey
      const response = await journeyAPI.create({
        title: formData.title.trim(),
        description: formData.description.trim(),
        targetDays: parseInt(formData.targetDays),
        startDate: startDateTime.toISOString(),
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        targetDays: 30,
        startDate: '',
        startTime: '09:00',
      });

      // Show notification prompt if not enabled
      if (permission !== 'granted') {
        setShowNotificationPrompt(true);
      }

      // Call parent callback
      if (onJourneyCreated) {
        onJourneyCreated(response.data.data.journey);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create journey');
    } finally {
      setLoading(false);
    }
  };

  const handleEnableNotifications = async () => {
    await enableNotifications();
    setShowNotificationPrompt(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-lg">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Create New Journey</h2>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Journey Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., 30-Day Meditation Challenge"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="What do you want to achieve with this journey?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
            />
          </div>

          {/* Target Days */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Target className="w-4 h-4 inline mr-1" />
              Target Days
            </label>
            <input
              type="number"
              name="targetDays"
              value={formData.targetDays}
              onChange={handleChange}
              min="1"
              max="365"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Number of days to track this journey (1-365)
            </p>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={getMinDate()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                min={getMinTime()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Notification Schedule Info */}
          {formData.startDate && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm mb-1">
                    Notification Schedule
                  </h4>
                  <p className="text-sm text-blue-700">
                    {getNotificationSchedule()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.title.trim() || !formData.startDate}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? 'Creating Journey...' : 'Create Journey'}
          </button>
        </div>
      </div>

      {/* Notification Enable Modal */}
      {showNotificationPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slide-down">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Journey Created! 🎉
              </h3>
              <p className="text-gray-600 mb-6">
                Enable notifications so you never miss when your journey starts
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleEnableNotifications}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Enable Notifications
                </button>
                <button
                  onClick={() => setShowNotificationPrompt(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// WHY THIS COMPONENT?
// - Form validation: Checks required fields and date validity
// - Date/time handling: Prevents past dates, sets minimum times
// - Real-time feedback: Shows notification schedule as user picks date
// - Context integration: Checks permission and offers to enable
// - Success modal: Contextual prompt after creating journey
// - Responsive grid: 2 columns on desktop, 1 on mobile
// - Gradient design: Modern, eye-catching UI
// - Error handling: Clear error messages for all failure cases