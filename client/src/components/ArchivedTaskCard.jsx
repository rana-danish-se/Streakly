import React from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaSpinner, FaCalendarPlus, FaArrowRight } from 'react-icons/fa';

const priorityColors = {
  low: {
    bg: 'rgba(59, 130, 246, 0.15)',
    color: '#3B82F6',
    border: 'rgba(59, 130, 246, 0.3)'
  },
  medium: {
    bg: 'rgba(249, 115, 22, 0.15)',
    color: '#F97316',
    border: 'rgba(249, 115, 22, 0.3)'
  },
  high: {
    bg: 'rgba(239, 68, 68, 0.15)',
    color: '#EF4444',
    border: 'rgba(239, 68, 68, 0.3)'
  }
};

const ArchivedTaskCard = ({ task, onMoveToToday, onSchedule, onDelete, isLoading = false, loadingAction = null }) => {
  const isMoveLoading = isLoading && loadingAction === 'move';
  const isDeleteLoading = isLoading && loadingAction === 'delete';
  const priority = task.priority || 'medium';
  const priorityStyle = priorityColors[priority];

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-3xl p-6 group cursor-pointer"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        y: -6,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, #6b7280 0%, transparent 100%)'
        }}
      />

      {/* Top Section: Title + Priority Badge */}
      <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 
            className="text-xl font-bold transition-all duration-300 flex-1"
            style={{ 
              color: 'var(--text)',
              lineHeight: '1.4',
              wordBreak: 'break-word',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
            title={task.title}
          >
            {task.title}
          </h3>
          <div className="text-sm mt-1" style={{ color: 'var(--text)', opacity: 0.6 }}>
            Missed on: {formatDate(task.originalDate)}
          </div>
        </div>
        
        {/* Priority Badge */}
        <div 
          className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase shrink-0"
          style={{ 
            backgroundColor: priorityStyle.bg,
            color: priorityStyle.color,
            border: `1px solid ${priorityStyle.border}`
          }}
        >
          {priority}
        </div>
      </div>

      {/* Bottom Section: Action Buttons */}
      <div className="relative z-10">
        <div className="flex items-center gap-2">
          {/* Move to Today Button */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); onMoveToToday(task._id); }}
            disabled={isLoading}
            className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-300 relative overflow-hidden"
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              color: '#22c55e',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            whileHover={!isLoading ? { scale: 1.02, backgroundColor: 'rgba(34, 197, 94, 0.25)' } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            {isMoveLoading ? (
              <FaSpinner className="text-sm relative z-10 animate-spin" />
            ) : (
              <FaArrowRight className="text-sm relative z-10" />
            )}
            <span className="relative z-10">Move to Today</span>
          </motion.button>

          {/* Schedule Button */}
          <motion.button 
            onClick={(e) => { e.stopPropagation(); onSchedule(task); }}
            disabled={isLoading}
            className="p-3 rounded-2xl"
            style={{ 
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              color: '#6366f1',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            whileHover={!isLoading ? { scale: 1.05, backgroundColor: 'rgba(99, 102, 241, 0.25)' } : {}}
            whileTap={!isLoading ? { scale: 0.95 } : {}}
            title="Schedule for later"
          >
            <FaCalendarPlus className="text-sm" />
          </motion.button>
          
          {/* Delete Button */}
          <motion.button 
            onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
            disabled={isLoading}
            className="p-3 rounded-2xl"
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            whileHover={!isLoading ? { scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.2)' } : {}}
            whileTap={!isLoading ? { scale: 0.95 } : {}}
            title="Delete task"
          >
            {isDeleteLoading ? (
              <FaSpinner className="text-sm animate-spin" />
            ) : (
              <FaTrash className="text-sm" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ArchivedTaskCard;
