
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaClock } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../index.css';

const AddDailyTaskModal = ({ isOpen, onClose, onSave, taskToEdit = null }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            // Parse time string "HH:mm" to Date object
            if (taskToEdit.time) {
                const [hours, minutes] = taskToEdit.time.split(':');
                const date = new Date();
                date.setHours(parseInt(hours, 10));
                date.setMinutes(parseInt(minutes, 10));
                setTime(date);
            }
        } else {
            // Reset for new task
            setTitle('');
            setTime(new Date());
        }
    }
  }, [isOpen, taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !time) return;

    setLoading(true);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      
      await onSave({ title, time: timeString, timezone });
      
      onClose();
    } catch (error) {
      console.error('Failed to save task', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
                {taskToEdit ? 'Edit Habit' : 'Add New Habit'}
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
                  placeholder="e.g. Read 10 pages, Gym"
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    backgroundColor: 'var(--bg)', 
                    color: 'var(--text)',
                    borderColor: 'rgba(128, 128, 128, 0.2)',
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                  Reminder Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <FaClock style={{ color: 'var(--text)', opacity: 0.4 }} />
                  </div>
                  <DatePicker
                    selected={time}
                    onChange={(date) => setTime(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    wrapperClassName="w-full"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all cursor-pointer"
                    popperClassName="react-datepicker-popper"
                    customInput={
                      <input 
                        style={{ 
                            backgroundColor: 'var(--bg)', 
                            color: 'var(--text)',
                            borderColor: 'rgba(128, 128, 128, 0.2)',
                        }}
                      />
                    }
                  />
                  <p className="mt-1 text-xs" style={{ color: 'var(--text)', opacity: 0.6 }}>
                    We'll remind you at this time every day.
                  </p>
                </div>
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
                  {loading ? 'Saving...' : (taskToEdit ? 'Update Habit' : 'Add Habit')}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddDailyTaskModal;
