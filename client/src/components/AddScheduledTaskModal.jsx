import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../index.css';

const AddScheduledTaskModal = ({ isOpen, onClose, onSave, taskToEdit = null }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [scheduledDate, setScheduledDate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setPriority(taskToEdit.priority || 'medium');
        // Convert YYYY-MM-DD to Date object
        if (taskToEdit.scheduledDate) {
          const [year, month, day] = taskToEdit.scheduledDate.split('-');
          setScheduledDate(new Date(year, month - 1, day));
        }
      } else {
        // Reset for new task - default to tomorrow
        setTitle('');
        setPriority('medium');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setScheduledDate(tomorrow);
      }
    }
  }, [isOpen, taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !scheduledDate) return;

    setLoading(true);
    try {
      // Convert Date to YYYY-MM-DD format
      const year = scheduledDate.getFullYear();
      const month = String(scheduledDate.getMonth() + 1).padStart(2, '0');
      const day = String(scheduledDate.getDate()).padStart(2, '0');
      const scheduledDateStr = `${year}-${month}-${day}`;

      await onSave({ title, priority, scheduledDate: scheduledDateStr });
      onClose();
    } catch (error) {
      console.error('Failed to save scheduled task', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Calculate minimum date (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl shadow-xl w-full max-w-md overflow-hidden border"
            style={{ 
              backgroundColor: 'var(--card)', 
              borderColor: 'var(--primary)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div 
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: 'rgba(128, 128, 128, 0.1)' }}
            >
              <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                {taskToEdit ? 'Edit Scheduled Task' : 'Schedule a Task'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ color: 'var(--text)', opacity: 0.6 }}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                  Task Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Meeting with John, Review report"
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    backgroundColor: 'var(--bg)', 
                    color: 'var(--text)',
                    borderColor: 'rgba(128, 128, 128, 0.2)',
                  }}
                  maxLength={200}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Priority
                </label>
                <div className="flex gap-3">
                  <label 
                    className="flex-1 cursor-pointer"
                    style={{ opacity: priority === 'low' ? 1 : 0.6 }}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value="low"
                      checked={priority === 'low'}
                      onChange={(e) => setPriority(e.target.value)}
                      className="sr-only"
                    />
                    <div 
                      className="px-4 py-3 rounded-xl text-center font-semibold text-sm transition-all border-2"
                      style={{ 
                        backgroundColor: priority === 'low' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                        color: '#3B82F6',
                        borderColor: priority === 'low' ? '#3B82F6' : 'rgba(59, 130, 246, 0.3)'
                      }}
                    >
                      Low
                    </div>
                  </label>
                  
                  <label 
                    className="flex-1 cursor-pointer"
                    style={{ opacity: priority === 'medium' ? 1 : 0.6 }}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value="medium"
                      checked={priority === 'medium'}
                      onChange={(e) => setPriority(e.target.value)}
                      className="sr-only"
                    />
                    <div 
                      className="px-4 py-3 rounded-xl text-center font-semibold text-sm transition-all border-2"
                      style={{ 
                        backgroundColor: priority === 'medium' ? 'rgba(249, 115, 22, 0.15)' : 'transparent',
                        color: '#F97316',
                        borderColor: priority === 'medium' ? '#F97316' : 'rgba(249, 115, 22, 0.3)'
                      }}
                    >
                      Medium
                    </div>
                  </label>
                  
                  <label 
                    className="flex-1 cursor-pointer"
                    style={{ opacity: priority === 'high' ? 1 : 0.6 }}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value="high"
                      checked={priority === 'high'}
                      onChange={(e) => setPriority(e.target.value)}
                      className="sr-only"
                    />
                    <div 
                      className="px-4 py-3 rounded-xl text-center font-semibold text-sm transition-all border-2"
                      style={{ 
                        backgroundColor: priority === 'high' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                        color: '#EF4444',
                        borderColor: priority === 'high' ? '#EF4444' : 'rgba(239, 68, 68, 0.3)'
                      }}
                    >
                      High
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Scheduled Date
                </label>
                <DatePicker
                  selected={scheduledDate}
                  onChange={(date) => setScheduledDate(date)}
                  minDate={minDate}
                  dateFormat="MMMM d, yyyy"
                  wrapperClassName="w-full"
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all cursor-pointer"
                  customInput={
                    <input 
                      style={{ 
                        backgroundColor: 'var(--bg)', 
                        color: 'var(--text)',
                        borderColor: 'rgba(128, 128, 128, 0.2)',
                      }}
                    />
                  }
                  required
                  placeholderText="Select a date"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ color: 'var(--text)' }}
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--primary)' }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? 'Saving...' : (taskToEdit ? 'Update Task' : 'Schedule Task')}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddScheduledTaskModal;
