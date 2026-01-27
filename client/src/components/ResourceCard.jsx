import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiFile, 
  FiImage, 
  FiFileText, 
  FiLink,
  FiTrash2,
  FiDownload,
  FiExternalLink
} from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const ResourceCard = ({ resource, viewMode, onDelete }) => {
  const { theme } = useTheme();

  // Helper to get formatted download URL for Cloudinary
  const getDownloadUrl = (url) => {
    if (!url || url.includes('fl_attachment')) return url;
    if (url.includes('res.cloudinary.com')) {
      return url.replace('/upload/', '/upload/fl_attachment/');
    }
    return url;
  };

  // Get icon and color for resource type
  const getResourceConfig = (type) => {
    const configs = {
      pdf: { 
        icon: <FiFileText className="w-6 h-6" />, 
        color: '#EF4444',
        bgColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
        label: 'PDF'
      },
      image: { 
        icon: <FiImage className="w-6 h-6" />, 
        color: '#8B5CF6',
        bgColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)',
        label: 'Image'
      },
      doc: { 
        icon: <FiFile className="w-6 h-6" />, 
        color: '#3B82F6',
        bgColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
        label: 'Document'
      },
      link: { 
        icon: <FiLink className="w-6 h-6" />, 
        color: '#10B981',
        bgColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
        label: 'Link'
      }
    };
    return configs[type] || configs.doc;
  };

  const config = getResourceConfig(resource.type);

  if (viewMode === 'grid') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="group relative rounded-2xl p-6 h-full flex flex-col"
        style={{ 
          backgroundColor: 'var(--card)',
          border: '1px solid',
          borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }}
        whileHover={{ 
          y: -4,
          boxShadow: `0 12px 24px ${theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
          borderColor: config.color
        }}
      >
        {/* Icon */}
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
          style={{ 
            backgroundColor: config.bgColor,
            color: config.color
          }}
        >
          {config.icon}
        </div>

        {/* Name */}
        <h4 
          className="font-bold mb-2 line-clamp-2"
          style={{ color: 'var(--text)' }}
        >
          {resource.name}
        </h4>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs opacity-60 mb-4 mt-auto" style={{ color: 'var(--text)' }}>
          <span>{config.label}</span>
          {resource.size && <span>{resource.size}</span>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {resource.type !== 'link' ? (
            <>
              <motion.a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-2 py-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5"
                style={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  color: 'var(--text)'
                }}
                whileHover={{ scale: 1.05, backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}
                whileTap={{ scale: 0.95 }}
              >
                <FiExternalLink className="w-3.5 h-3.5" />
                Open
              </motion.a>
              <motion.a
                href={getDownloadUrl(resource.url)}
                className="flex-1 px-2 py-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5"
                style={{ 
                  backgroundColor: config.bgColor,
                  color: config.color
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiDownload className="w-3.5 h-3.5" />
                Download
              </motion.a>
            </>
          ) : (
            <motion.a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: config.bgColor,
                color: config.color
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiExternalLink className="w-4 h-4" />
              Open Link
            </motion.a>
          )}
          <motion.button
            onClick={() => onDelete(resource.id)}
            className="p-2 rounded-lg"
            style={{ 
              backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
              color: 'var(--danger)'
            }}
            whileHover={{ scale: 1.1, backgroundColor: 'var(--danger)', color: '#fff' }}
            whileTap={{ scale: 0.9 }}
          >
            <FiTrash2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Date badge */}
        <div 
          className="absolute top-4 right-4 px-2 py-1 rounded-lg text-xs font-medium"
          style={{ 
            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            color: 'var(--text)',
            opacity: 0.6
          }}
        >
          {resource.uploadedAt}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-4 p-4 rounded-xl"
      style={{ 
        backgroundColor: 'var(--card)',
        border: '1px solid',
        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
      }}
      whileHover={{ 
        x: 5,
        borderColor: config.color
      }}
    >
      {/* Icon */}
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ 
          backgroundColor: config.bgColor,
          color: config.color
        }}
      >
        {config.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold truncate" style={{ color: 'var(--text)' }}>
          {resource.name}
        </h4>
        <div className="flex items-center gap-4 text-xs opacity-60 mt-1" style={{ color: 'var(--text)' }}>
          <span>{config.label}</span>
          {resource.size && <span>{resource.size}</span>}
          <span>{resource.uploadedAt}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {resource.type !== 'link' && (
          <motion.a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
            style={{ 
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              color: 'var(--text)'
            }}
            whileHover={{ scale: 1.05, backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}
            whileTap={{ scale: 0.95 }}
          >
            <FiExternalLink className="w-4 h-4" />
            Open
          </motion.a>
        )}
        <motion.a
            href={resource.type === 'link' ? resource.url : getDownloadUrl(resource.url)}
            target={resource.type === 'link' ? "_blank" : undefined}
            rel={resource.type === 'link' ? "noopener noreferrer" : undefined}
          className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
          style={{ 
            backgroundColor: config.bgColor,
            color: config.color
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {resource.type === 'link' ? <FiExternalLink className="w-4 h-4" /> : <FiDownload className="w-4 h-4" />}
          {resource.type === 'link' ? 'Open Link' : 'Download'}
        </motion.a>
        <motion.button
          onClick={() => onDelete(resource.id)}
          className="p-2 rounded-lg"
          style={{ 
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
            color: 'var(--danger)'
          }}
          whileHover={{ scale: 1.1, backgroundColor: 'var(--danger)', color: '#fff' }}
          whileTap={{ scale: 0.9 }}
        >
          <FiTrash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResourceCard;
