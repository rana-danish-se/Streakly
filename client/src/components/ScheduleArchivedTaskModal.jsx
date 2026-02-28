import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';

const ScheduleArchivedTaskModal = ({ isOpen, onClose, onSave, isLoading }) => {
  const [scheduledDate, setScheduledDate] = useState('');

  // Get tomorrow's date as string (YYYY-MM-DD)
  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  const minDate = getMinDate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(scheduledDate);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isLoading ? undefined : onClose}
          className="absolute inset-0"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)'
          }}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md rounded-3xl p-6 sm:p-8"
          style={{ 
            backgroundColor: 'var(--card)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <FaCalendarAlt style={{ color: 'var(--primary)' }} />
              Schedule Task
            </h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              style={{ color: 'var(--text)', opacity: isLoading ? 0.5 : 0.7 }}
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Scheduled Date */}
            <div className="space-y-2">
              <label 
                className="block text-sm font-medium ml-1"
                style={{ color: 'var(--text)', opacity: 0.9 }}
              >
                Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={minDate}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-2xl bg-transparent border-2 transition-all outline-none"
                  style={{ 
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--text)',
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>
              <p className="text-xs ml-1" style={{ color: 'var(--text)', opacity: 0.5 }}>
                Select a future date
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-3 px-4 rounded-xl font-semibold transition-colors"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !scheduledDate}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Schedule'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ScheduleArchivedTaskModal;
