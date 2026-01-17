import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiTrash2, FiTarget, FiFileText, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { createJourney } from '../services/journeyService';

const JourneyModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDays: 30,
    startDate: new Date().toISOString().split('T')[0]
  });
  const [startMode, setStartMode] = useState('today'); 
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      return; 
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (formData.targetDays < 1 || formData.targetDays > 365) {
      newErrors.targetDays = 'Target days must be between 1 and 365';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const journeyData = {
        ...formData
      };

      const response = await createJourney(journeyData);
      if (response.success) {
        toast.success('Journey created successfully! 🎉');
        onSuccess(response.data);
        handleClose();
      }
    } catch (error) {
      console.error('Error saving journey:', error);
      toast.error(error.response?.data?.message || 'Failed to save journey');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ 
      title: '', 
      description: '', 
      targetDays: 30, 
      startDate: new Date().toISOString().split('T')[0] 
    });
    setStartMode('today');
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-700"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-8 py-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Create New Journey</h2>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Start tracking your learning goals</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-700 dark:text-slate-300" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Title */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                    <FiTarget className="w-4 h-4" />
                    Journey Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., JavaScript Mastery, Daily Meditation"
                    className={`w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 ${
                      errors.title 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-200 dark:border-slate-700 focus:border-teal-500'
                    } rounded-xl focus:outline-none text-gray-900 dark:text-slate-50 transition-all`}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                    <FiFileText className="w-4 h-4" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="What do you want to learn or achieve?"
                    rows="3"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 focus:border-teal-500 rounded-xl focus:outline-none text-gray-900 dark:text-slate-50 transition-all resize-none"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">
                    <FiCalendar className="w-4 h-4" />
                    When do you want to start?
                  </label>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStartMode('today');
                        setFormData(prev => ({ ...prev, startDate: new Date().toISOString().split('T')[0] }));
                      }}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                        startMode === 'today'
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                          : 'border-gray-200 dark:border-slate-700 hover:border-teal-200 dark:hover:border-slate-600 text-gray-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="font-semibold">Start Today</span>
                      <span className="text-xs opacity-70">{new Date().toLocaleDateString()}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStartMode('custom')}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                        startMode === 'custom'
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                          : 'border-gray-200 dark:border-slate-700 hover:border-teal-200 dark:hover:border-slate-600 text-gray-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="font-semibold">Pick Date</span>
                      <span className="text-xs opacity-70">Select future date</span>
                    </button>
                  </div>
                  
                  {startMode === 'custom' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                          handleInputChange(e);
                          setStartMode('custom');
                        }}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 focus:border-teal-500 rounded-xl focus:outline-none text-gray-900 dark:text-slate-50 transition-all mb-4"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Target Days */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                    <FiCalendar className="w-4 h-4" />
                    Target Days
                  </label>
                  <input
                    type="number"
                    name="targetDays"
                    value={formData.targetDays}
                    onChange={handleInputChange}
                    min="1"
                    max="365"
                    className={`w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 ${
                      errors.targetDays 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-200 dark:border-slate-700 focus:border-teal-500'
                    } rounded-xl focus:outline-none text-gray-900 dark:text-slate-50 transition-all`}
                  />
                  {errors.targetDays && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.targetDays}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-semibold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 hover:from-teal-700 hover:via-emerald-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FiPlus className="w-5 h-5" />
                        Create Journey
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JourneyModal;
