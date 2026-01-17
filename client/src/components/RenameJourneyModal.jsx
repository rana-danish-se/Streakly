import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTarget, FiFileText, FiEdit2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { updateJourney } from '../services/journeyService';

const RenameJourneyModal = ({ isOpen, onClose, onSuccess, journey }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (journey) {
      setFormData({
        title: journey.title || '',
        description: journey.description || ''
      });
    }
  }, [journey, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await updateJourney(journey._id, formData);
      if (response.success) {
        toast.success('Journey renamed successfully!');
        onSuccess(response.data);
        handleClose();
      }
    } catch (error) {
      console.error('Error renaming journey:', error);
      toast.error(error.response?.data?.message || 'Failed to rename journey');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '' });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 dark:border-slate-700"
            >
              <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-8 py-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Rename Journey</h2>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Update title and description</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-700 dark:text-slate-300" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
                    placeholder="e.g., JavaScript Mastery"
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

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                    <FiFileText className="w-4 h-4" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description..."
                    rows="3"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 focus:border-teal-500 rounded-xl focus:outline-none text-gray-900 dark:text-slate-50 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
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
                    className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                     {isLoading ? 'Saving...' : (
                      <>
                        <FiEdit2 className="w-4 h-4" />
                        Rename
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

export default RenameJourneyModal;
