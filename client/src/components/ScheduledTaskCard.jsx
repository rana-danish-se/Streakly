import React from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaCalendar } from 'react-icons/fa';

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

// Helper function to format date and calculate days away
const formatScheduledDate = (scheduledDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(scheduledDate + 'T00:00:00');
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { label: 'Today', daysAway: 0, color: '#EF4444' };
  if (diffDays === 1) return { label: 'Tomorrow', daysAway: 1, color: '#F97316' };
  if (diffDays === 2) return { label: 'In 2 days', daysAway: 2, color: '#3B82F6' };
  if (diffDays <= 7) return { label: `In ${diffDays} days`, daysAway: diffDays, color: '#3B82F6' };
  
  // Format as "Feb 10"
  const options = { month: 'short', day: 'numeric' };
  return { 
    label: targetDate.toLocaleDateString('en-US', options), 
    daysAway: diffDays,
    color: '#3B82F6'
  };
};

const ScheduledTaskCard = ({ task, onEdit, onDelete, isLoading = false, loadingAction = null }) => {
  const isDeleteLoading = isLoading && loadingAction === 'delete';
  const priority = task.priority || 'medium';
  const priorityStyle = priorityColors[priority];
  const dateInfo = formatScheduledDate(task.scheduledDate);
  
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
          background: 'linear-gradient(135deg, var(--primary) 0%, transparent 100%)'
        }}
      />

      {/* Top Section: Title + Priority Badge */}
      <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
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

      {/* Middle Section: Date Info */}
      <div className="relative z-10 mb-4">
        <div 
          className="flex items-center gap-2 px-4 py-3 rounded-xl"
          style={{
            backgroundColor: `${dateInfo.color}15`,
            border: `1px solid ${dateInfo.color}30`
          }}
        >
          <FaCalendar style={{ color: dateInfo.color }} />
          <div className="flex-1">
            <div className="font-semibold text-sm" style={{ color: dateInfo.color }}>
              {dateInfo.label}
            </div>
            {dateInfo.daysAway > 0 && (
              <div className="text-xs opacity-75" style={{ color: 'var(--text)' }}>
                {dateInfo.daysAway} {dateInfo.daysAway === 1 ? 'day' : 'days'} away
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Action Buttons */}
      <div className="relative z-10">
        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <motion.button 
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            disabled={isLoading}
            className="flex-1 py-4 rounded-2xl font-bold text-base"
            style={{ 
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
            }}
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            <span className="relative z-10">Edit</span>
          </motion.button>
          
          {/* Delete Button */}
          <motion.button 
            onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
            disabled={isLoading}
            className="p-4 rounded-2xl"
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              backdropFilter: 'blur(8px)',
              color: '#EF4444',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            whileHover={!isLoading ? { 
              scale: 1.05,
              backgroundColor: 'rgba(239, 68, 68, 0.2)'
            } : {}}
            whileTap={!isLoading ? { scale: 0.95 } : {}}
            title="Delete task"
          >
            {isDeleteLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaTrash className="text-sm" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ScheduledTaskCard;
