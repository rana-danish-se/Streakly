import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTrash, FaSpinner } from 'react-icons/fa';

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

const TodayTaskCard = ({ task, onToggleComplete, onEdit, onDelete, isLoading = false, loadingAction = null }) => {
  const isCompleted = task.completed;
  const isToggleLoading = isLoading && loadingAction === 'toggle';
  const isDeleteLoading = isLoading && loadingAction === 'delete';
  const priority = task.priority || 'medium';
  const priorityStyle = priorityColors[priority];
  
  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-3xl p-6 group cursor-pointer"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid',
        borderColor: isCompleted 
          ? 'rgba(34, 197, 94, 0.3)' 
          : 'rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        y: -6,
        borderColor: isCompleted 
          ? 'rgba(34, 197, 94, 0.5)' 
          : 'rgba(255, 255, 255, 0.15)',
        boxShadow: isCompleted 
          ? '0 20px 40px -8px rgba(34, 197, 94, 0.25), 0 0 0 1px rgba(34, 197, 94, 0.1)'
          : '0 20px 40px -8px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
        style={{
          background: isCompleted
            ? 'linear-gradient(135deg, var(--success) 0%, transparent 100%)'
            : 'linear-gradient(135deg, var(--primary) 0%, transparent 100%)'
        }}
      />

      {/* Top Section: Title + Priority Badge */}
      <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
        <h3 
          className={`text-xl font-bold transition-all duration-300 flex-1 ${
            isCompleted ? 'line-through opacity-60' : ''
          }`}
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

      {/* Bottom Section: Action Buttons */}
      <div className="relative z-10">
        <div className="flex items-center gap-2">
          {/* Complete Button */}
          <motion.button
            onClick={() => onToggleComplete(task)}
            disabled={isLoading}
            className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-base transition-all duration-300 relative overflow-hidden"
            style={{
              backgroundColor: isCompleted ? 'var(--success)' : 'var(--primary)',
              color: '#FFFFFF',
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: isCompleted
                ? '0 4px 16px rgba(34, 197, 94, 0.3)'
                : '0 4px 16px rgba(99, 102, 241, 0.3)'
            }}
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            {isCompleted && !isToggleLoading && (
              <motion.div
                className="absolute inset-0"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                }}
              />
            )}
            {isToggleLoading ? (
              <FaSpinner className="text-lg relative z-10 animate-spin" />
            ) : (
              <FaCheck className="text-lg relative z-10" />
            )}
            <span className="relative z-10 hidden sm:inline">
              {isToggleLoading ? 'Updating...' : (isCompleted ? 'Completed' : 'Complete')}
            </span>
          </motion.button>

          {/* Edit Button */}
          <motion.button 
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            disabled={isLoading}
            className="p-4 rounded-2xl"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(8px)',
              color: 'var(--text)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            whileHover={!isLoading ? { 
              scale: 1.05,
              backgroundColor: 'rgba(255, 255, 255, 0.12)'
            } : {}}
            whileTap={!isLoading ? { scale: 0.95 } : {}}
            title="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
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

export default TodayTaskCard;
