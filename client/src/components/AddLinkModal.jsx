import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const AddLinkModal = ({ 
  isOpen, 
  onClose, 
  linkName, 
  setLinkName, 
  linkUrl, 
  setLinkUrl, 
  onSubmit 
}) => {
  const { theme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-md rounded-2xl p-6"
              style={{ backgroundColor: 'var(--card)' }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                  Add Resource Link
                </h3>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg"
                  style={{ 
                    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                  }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX className="w-5 h-5" style={{ color: 'var(--text)' }} />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
                    Resource Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                    placeholder="e.g., MDN Documentation"
                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      color: 'var(--text)',
                      border: '1px solid',
                      borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
                    URL *
                  </label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      color: 'var(--text)',
                      border: '1px solid',
                      borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 rounded-xl font-bold"
                    style={{ 
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      color: 'var(--text)'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={onSubmit}
                    disabled={!linkUrl.trim()}
                    className="flex-1 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                    style={{ 
                      background: !linkUrl.trim() 
                        ? (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)') 
                        : 'var(--primary)',
                      color: !linkUrl.trim() ? 'var(--text)' : '#FFFFFF',
                      opacity: !linkUrl.trim() ? 0.5 : 1
                    }}
                    whileHover={linkUrl.trim() ? { scale: 1.02 } : {}}
                    whileTap={linkUrl.trim() ? { scale: 0.98 } : {}}
                  >
                    Add Link
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddLinkModal;
