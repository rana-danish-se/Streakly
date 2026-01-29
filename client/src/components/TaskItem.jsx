import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiMoreVertical, FiEdit2, FiTrash2, FiClock } from 'react-icons/fi';

import { toast } from 'react-toastify';

const TaskItem = ({ task, journeyStatus, startDate, onUpdate, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(task.name);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = async () => {
    if (journeyStatus === 'pending') {
      toast.info(`Journey starts on ${new Date(startDate).toLocaleDateString()}`);
      return;
    }
    
    setIsLoading(true);
    try {
      await onUpdate(task._id, { completed: !task.completed });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (editName.trim() && editName !== task.name) {
      setIsLoading(true);
      try {
        await onUpdate(task._id, { name: editName });
        setIsEditing(false); // Only close if successful? Assuming onUpdate throws if failed.
        setIsMenuOpen(false);
      } finally {
        setIsLoading(false);
      }
    } else {
        setIsEditing(false);
        setIsMenuOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditName(task.name);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      className={`group flex items-center gap-3 p-3 rounded-lg border border-transparent hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors ${
        (task.completed || isDeleting) ? 'opacity-50' : ''
      }`}
    >
      <button
        onClick={handleToggleComplete}
        disabled={isLoading}
        className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all ${
          task.completed
            ? 'bg-slate-900 border-slate-900 text-white'
            : 'bg-white border-slate-300 hover:border-slate-900'
        }`}
      >
        {isLoading ? (
          <div className={`w-4 h-4 border-2 rounded-full animate-spin ${
            task.completed 
              ? 'border-white/50 border-t-white' 
              : 'border-slate-300 border-t-slate-600'
          }`} />
        ) : (
          <AnimatePresence>
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <FiCheck className="w-5 h-5 stroke-[3]" />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveEdit} 
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-b-2 border-teal-500 focus:outline-none text-gray-900 dark:text-slate-50 font-medium px-1 py-0.5"
          />
        ) : (
          <div className={task.completed ? 'opacity-50' : ''}>
            <p className={`font-medium text-gray-900 dark:text-slate-50 break-words ${
              task.completed ? 'line-through decoration-gray-400 dark:decoration-slate-500' : ''
            }`}>
              {task.name}
            </p>
            {task.completedAt && (
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                Completed {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(task.completedAt))}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="relative"> 
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`p-2 rounded-lg transition-colors ${
            isMenuOpen 
              ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-50' 
              : 'text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100'
          }`}
        >
          <FiMoreVertical />
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsMenuOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-20"
              >
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <FiEdit2 className="w-3 h-3" /> Edit
                </button>
                  <button
                    onClick={async () => {
                      if (!window.confirm("Delete this task?")) return;
                      setIsDeleting(true);
                      setIsMenuOpen(false);
                      try {
                        await onDelete(task._id);
                      } catch {
                        setIsDeleting(false); // Reset if failed, otherwise component unmounts
                      }
                    }}
                    disabled={isDeleting}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    {isDeleting ? <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <FiTrash2 className="w-3 h-3" />}
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TaskItem;
