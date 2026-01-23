import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX,
  FiCalendar,
  FiTarget,
  FiBook,
  FiFileText,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-toastify';
import { createJourney } from '../services/journeyService';

const JourneyModal = ({ isOpen, onClose, onSuccess }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: 'today',
    customDate: '',
    targetDays: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
  }, [isOpen]);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get minimum date (today)
  const getMinDate = () => getTodayDate();

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Journey title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (formData.startDate === 'custom' && !formData.customDate) {
      newErrors.customDate = 'Please select a start date';
    }

    if (!formData.targetDays) {
      newErrors.targetDays = 'Target days is required';
    } else if (formData.targetDays < 1) {
      newErrors.targetDays = 'Target days must be at least 1';
    } else if (formData.targetDays > 365) {
      newErrors.targetDays = 'Target days cannot exceed 365';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const journeyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        startDate: formData.startDate === 'today' ? getTodayDate() : formData.customDate,
        targetDays: parseInt(formData.targetDays)
      };

      const response = await createJourney(journeyData);
      
      if (response.success) {
        toast.success('Journey created successfully! 🎉');
        onSuccess?.(response.data);
        handleClose();
      }
    } catch (error) {
      console.error('Error creating journey:', error);
      toast.error(error.response?.data?.message || 'Failed to create journey');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      startDate: 'today',
      customDate: '',
      targetDays: ''
    });
    setErrors({});
    setIsSubmitting(false);
    onClose?.();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="w-full max-w-2xl max-h-[90vh] pointer-events-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div
                className="rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                style={{ backgroundColor: 'var(--card)' }}
              >
                {/* Header */}
                <div
                  className="relative p-8 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, var(--primary) 0%, var(--success) 100%)`,
                    color: '#FFFFFF'
                  }}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 overflow-hidden opacity-20">
                    <motion.div
                      className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <HiSparkles className="w-6 h-6" />
                          <span className="text-sm font-semibold opacity-90">
                            New Learning Path
                          </span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">
                          Create Journey
                        </h2>
                        <p className="opacity-90">
                          Start tracking your learning progress today
                        </p>
                      </div>

                      {/* Close Button */}
                      <motion.button
                        onClick={handleClose}
                        className="p-2 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm"
                        whileHover={{ scale: 1.1, rotate: 90, backgroundColor: 'rgba(255,255,255,0.3)' }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiX className="w-6 h-6" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1">
                  {/* Journey Title */}
                  <div>
                    <label 
                      className="flex items-center gap-2 text-sm font-semibold mb-2"
                      style={{ color: 'var(--text)' }}
                    >
                      <FiBook className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      Journey Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="e.g., JavaScript Mastery, React Deep Dive"
                      className="w-full px-4 py-3 rounded-xl font-medium transition-all focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        color: 'var(--text)',
                        border: '2px solid',
                        borderColor: errors.title 
                          ? 'var(--danger)' 
                          : theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        ringColor: 'var(--primary)'
                      }}
                      maxLength={100}
                    />
                    {errors.title && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-sm mt-2"
                        style={{ color: 'var(--danger)' }}
                      >
                        <FiAlertCircle className="w-4 h-4" />
                        {errors.title}
                      </motion.p>
                    )}
                    <p 
                      className="text-xs mt-1 opacity-50"
                      style={{ color: 'var(--text)' }}
                    >
                      {formData.title.length}/100 characters
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label 
                      className="flex items-center gap-2 text-sm font-semibold mb-2"
                      style={{ color: 'var(--text)' }}
                    >
                      <FiFileText className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Briefly describe what you'll learn in this journey..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 resize-none"
                      style={{ 
                        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        color: 'var(--text)',
                        border: '2px solid',
                        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        ringColor: 'var(--primary)'
                      }}
                      maxLength={500}
                    />
                    <p 
                      className="text-xs mt-1 opacity-50"
                      style={{ color: 'var(--text)' }}
                    >
                      {formData.description.length}/500 characters
                    </p>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label 
                      className="flex items-center gap-2 text-sm font-semibold mb-3"
                      style={{ color: 'var(--text)' }}
                    >
                      <FiCalendar className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      Start Date *
                    </label>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Start Today */}
                      <motion.button
                        type="button"
                        onClick={() => handleChange('startDate', 'today')}
                        className="p-4 rounded-xl font-semibold flex flex-col items-center gap-2 transition-all"
                        style={{ 
                          backgroundColor: formData.startDate === 'today' 
                            ? 'var(--primary)' 
                            : theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                          color: formData.startDate === 'today' ? '#FFFFFF' : 'var(--text)',
                          border: '2px solid',
                          borderColor: formData.startDate === 'today' 
                            ? 'var(--primary)' 
                            : theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {formData.startDate === 'today' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                          >
                            <FiCheck className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                          </motion.div>
                        )}
                        <span>Start Today</span>
                        <span className="text-xs opacity-70">
                          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </motion.button>

                      {/* Pick Custom Date */}
                      <motion.button
                        type="button"
                        onClick={() => handleChange('startDate', 'custom')}
                        className="p-4 rounded-xl font-semibold flex flex-col items-center gap-2 transition-all"
                        style={{ 
                          backgroundColor: formData.startDate === 'custom' 
                            ? 'var(--primary)' 
                            : theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                          color: formData.startDate === 'custom' ? '#FFFFFF' : 'var(--text)',
                          border: '2px solid',
                          borderColor: formData.startDate === 'custom' 
                            ? 'var(--primary)' 
                            : theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {formData.startDate === 'custom' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                          >
                            <FiCheck className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                          </motion.div>
                        )}
                        <span>Pick a Date</span>
                        <span className="text-xs opacity-70">Custom start</span>
                      </motion.button>
                    </div>

                    {/* Custom Date Picker */}
                    <AnimatePresence>
                      {formData.startDate === 'custom' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <input
                            type="date"
                            value={formData.customDate}
                            onChange={(e) => handleChange('customDate', e.target.value)}
                            min={getMinDate()}
                            className="w-full px-4 py-3 rounded-xl font-medium transition-all focus:outline-none focus:ring-2"
                            style={{ 
                              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                              color: 'var(--text)',
                              border: '2px solid',
                              borderColor: errors.customDate 
                                ? 'var(--danger)' 
                                : theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                              ringColor: 'var(--primary)'
                            }}
                          />
                          {errors.customDate && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-1 text-sm mt-2"
                              style={{ color: 'var(--danger)' }}
                            >
                              <FiAlertCircle className="w-4 h-4" />
                              {errors.customDate}
                            </motion.p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Target Days */}
                  <div>
                    <label 
                      className="flex items-center gap-2 text-sm font-semibold mb-2"
                      style={{ color: 'var(--text)' }}
                    >
                      <FiTarget className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      Target Days *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.targetDays}
                        onChange={(e) => handleChange('targetDays', e.target.value)}
                        placeholder="e.g., 30, 60, 90"
                        min="1"
                        max="365"
                        className="w-full px-4 py-3 rounded-xl font-medium transition-all focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                          color: 'var(--text)',
                          border: '2px solid',
                          borderColor: errors.targetDays 
                            ? 'var(--danger)' 
                            : theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          ringColor: 'var(--primary)'
                        }}
                      />
                      <div 
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-semibold opacity-50"
                        style={{ color: 'var(--text)' }}
                      >
                        days
                      </div>
                    </div>
                    {errors.targetDays && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-sm mt-2"
                        style={{ color: 'var(--danger)' }}
                      >
                        <FiAlertCircle className="w-4 h-4" />
                        {errors.targetDays}
                      </motion.p>
                    )}
                    <p 
                      className="text-xs mt-1 opacity-50"
                      style={{ color: 'var(--text)' }}
                    >
                      Set a realistic goal between 1-365 days
                    </p>

                    {/* Quick Select Buttons */}
                    <div className="flex gap-2 mt-3">
                      {[30, 60, 90, 120].map((days) => (
                        <motion.button
                          key={days}
                          type="button"
                          onClick={() => handleChange('targetDays', days.toString())}
                          className="px-4 py-2 rounded-lg text-sm font-semibold"
                          style={{ 
                            backgroundColor: formData.targetDays === days.toString()
                              ? 'var(--primary)'
                              : theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                            color: formData.targetDays === days.toString() ? '#FFFFFF' : 'var(--text)',
                            border: '1px solid',
                            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {days}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <motion.button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-6 py-4 rounded-xl font-bold"
                      style={{ 
                        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        color: 'var(--text)',
                        border: '2px solid',
                        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                      }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </motion.button>

                    <motion.button
                      type="submit"
                      className="flex-1 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                      style={{ 
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        opacity: isSubmitting ? 0.7 : 1
                      }}
                      whileHover={!isSubmitting ? { scale: 1.02, y: -2, boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)' } : {}}
                      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Creating...
                        </>
                      ) : (
                        <>
                          <FiCheck className="w-5 h-5" />
                          Create Journey
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JourneyModal;
