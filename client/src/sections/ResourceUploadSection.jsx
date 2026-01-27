import React from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiLink } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const ResourceUploadSection = ({ 
  dragActive, 
  handleDrag, 
  handleDrop, 
  handleFileUpload, 
  onAddLink 
}) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative rounded-2xl overflow-hidden"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl"
          style={{ 
            background: `radial-gradient(circle, var(--primary) 0%, transparent 70%)`,
            opacity: 0.2
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl"
          style={{ 
            background: `radial-gradient(circle, var(--success) 0%, transparent 70%)`,
            opacity: 0.2
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Upload Card */}
      <motion.div
        className="relative p-12 rounded-2xl text-center"
        style={{ 
          backgroundColor: 'var(--card)',
          border: '2px dashed',
          borderColor: dragActive ? 'var(--primary)' : (theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)')
        }}
        animate={{
          borderColor: dragActive ? 'var(--primary)' : (theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'),
          backgroundColor: dragActive ? (theme === 'dark' ? 'rgba(129, 140, 248, 0.05)' : 'rgba(99, 102, 241, 0.03)') : 'var(--card)'
        }}
      >
        {/* Icon */}
        <motion.div
          className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
          style={{ 
            background: `linear-gradient(135deg, var(--primary) 0%, var(--success) 100%)`,
            boxShadow: `0 10px 30px ${theme === 'dark' ? 'rgba(129, 140, 248, 0.3)' : 'rgba(99, 102, 241, 0.2)'}`
          }}
          animate={dragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
        >
          <FiUpload className="w-10 h-10 text-white" />
        </motion.div>

        {/* Text */}
        <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          {dragActive ? 'Drop files here!' : 'Upload Resources'}
        </h3>
        <p className="text-sm opacity-60 mb-8" style={{ color: 'var(--text)' }}>
          Drag and drop files or click to browse
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4">
          <label>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              onChange={handleFileUpload}
              className="hidden"
            />
            <motion.div
              className="px-8 py-3 rounded-xl font-bold cursor-pointer flex items-center gap-2"
              style={{ 
                background: `linear-gradient(135deg, var(--primary) 0%, var(--success) 100%)`,
                color: '#FFFFFF',
                boxShadow: `0 8px 24px ${theme === 'dark' ? 'rgba(129, 140, 248, 0.35)' : 'rgba(99, 102, 241, 0.25)'}`
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiUpload className="w-5 h-5" />
              Browse Files
            </motion.div>
          </label>

          <motion.button
            onClick={onAddLink}
            className="px-8 py-3 rounded-xl font-bold flex items-center gap-2"
            style={{ 
              backgroundColor: 'var(--card)',
              color: 'var(--text)',
              border: '2px solid',
              borderColor: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'
            }}
            whileHover={{ scale: 1.05, borderColor: 'var(--primary)' }}
            whileTap={{ scale: 0.95 }}
          >
            <FiLink className="w-5 h-5" />
            Add Link
          </motion.button>
        </div>

        {/* Supported formats */}
        <p className="text-xs opacity-40 mt-6" style={{ color: 'var(--text)' }}>
          Supported: PDF, DOC, DOCX, JPG, PNG, GIF (Max 10MB)
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ResourceUploadSection;
