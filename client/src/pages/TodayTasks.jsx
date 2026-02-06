import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import todayTaskService from '../services/todayTaskService';
import AddTodayTaskModal from '../components/AddTodayTaskModal';
import TodayTaskCard from '../components/TodayTaskCard';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Confetti from 'react-confetti';

const TodayTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const data = await todayTaskService.getTodayTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load tasks');
    } finally {
      setTasksLoading(false);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (taskToEdit) {
        // Update existing
        const updatedTask = await todayTaskService.updateTodayTask(taskToEdit._id, taskData);
        setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
        toast.success('Task updated successfully!');
      } else {
        // Create new
        const newTask = await todayTaskService.createTodayTask(taskData);
        setTasks([...tasks, newTask]);
        toast.success('Task added successfully!');
      }
      setTaskToEdit(null);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Failed to save task';
      toast.error(message);
      throw error;
    }
  };

  const openAddModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleToggleComplete = async (task) => {
    setLoadingTaskId(task._id);
    setActionType('toggle');
    
    try {
      const updatedTask = await todayTaskService.toggleTodayTaskCompletion(task._id);
      
      setTasks(tasks.map(t => 
        t._id === task._id ? updatedTask : t
      ));

      if (updatedTask.completed) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        toast.success('Great job! Task completed! 🎉');
      } else {
        toast.info('Task marked as incomplete');
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    } finally {
      setLoadingTaskId(null);
      setActionType(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    setLoadingTaskId(taskId);
    setActionType('delete');
    
    try {
      await todayTaskService.deleteTodayTask(taskId);
      setTasks(tasks.filter(t => t._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setLoadingTaskId(null);
      setActionType(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-600 dark:border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Filter tasks by priority
  const filteredTasks = priorityFilter === 'all' 
    ? tasks 
    : tasks.filter(t => t.priority === priorityFilter);

  // Calculate stats (based on all tasks)
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Priority filter buttons config
  const priorityFilters = [
    { id: 'all', label: 'All', color: 'var(--primary)' },
    { id: 'high', label: 'High', color: '#EF4444' },
    { id: 'medium', label: 'Medium', color: '#F97316' },
    { id: 'low', label: 'Low', color: '#3B82F6' }
  ];

  return (
    <div className="min-h-screen p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: 'var(--primary)' }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: 'var(--success)' }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
      
      <div className="flex gap-4 relative z-10">
        <Sidebar />
        
        <main 
          className="lg:ml-80 w-full p-6 min-h-screen"
          style={{ backgroundColor: 'transparent' }}
        >
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-500"
                  style={{ color: 'var(--text)' }}
                >
                  Today's <span style={{ color: 'var(--primary)' }}>Tasks</span>
                </h1>
                <p className="mt-1" style={{ color: 'var(--text)', opacity: 0.7 }}>
                  Focus on what matters today. Tasks reset at midnight.
                </p>
                {totalCount > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                      <FaCheck className="text-xs" style={{ color: 'var(--success)' }} />
                      <span className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
                        {completedCount}/{totalCount} completed ({completionRate}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <motion.button
                onClick={openAddModal}
                className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium"
                style={{ backgroundColor: 'var(--primary)' }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus /> Add Task
              </motion.button>
            </div>

            {/* Priority Filter Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              {priorityFilters.map((filter) => {
                const isActive = priorityFilter === filter.id;
                return (
                  <motion.button
                    key={filter.id}
                    onClick={() => setPriorityFilter(filter.id)}
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                    style={{
                      backgroundColor: isActive ? filter.color : 'transparent',
                      color: isActive ? '#FFFFFF' : 'var(--text)',
                      border: `2px solid ${isActive ? filter.color : 'rgba(128, 128, 128, 0.2)'}`,
                      opacity: isActive ? 1 : 0.7
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      opacity: 1,
                      borderColor: filter.color
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {filter.label}
                    {filter.id !== 'all' && (
                      <span className="ml-1.5 text-xs opacity-75">
                        ({tasks.filter(t => t.priority === filter.id).length})
                      </span>
                    )}
                    {filter.id === 'all' && (
                      <span className="ml-1.5 text-xs opacity-75">
                        ({tasks.length})
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {tasksLoading ? (
              <div className="flex justify-center p-12">
                <div 
                  className="w-12 h-12 border-4 rounded-full animate-spin"
                  style={{ 
                    borderColor: 'var(--primary)',
                    borderTopColor: 'transparent'
                  }}
                ></div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div 
                className="text-center py-20 rounded-3xl border-2 border-dashed"
                style={{ 
                  backgroundColor: 'var(--card)', 
                  borderColor: 'var(--primary)',
                  opacity: 0.8
                }}
              >
                <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--text)' }}>
                  {tasks.length === 0 ? 'No tasks for today' : `No ${priorityFilter} priority tasks`}
                </h3>
                <p className="mb-6" style={{ color: 'var(--text)', opacity: 0.6 }}>
                  {tasks.length === 0 ? 'Start your day with a clear plan!' : 'Try a different filter or create a new task'}
                </p>
                {tasks.length === 0 && (
                  <button
                    onClick={openAddModal}
                    className="font-medium hover:underline"
                    style={{ color: 'var(--primary)' }}
                  >
                    Create your first task
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {filteredTasks.map((task) => (
                  <TodayTaskCard
                    key={task._id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={openEditModal}
                    onDelete={handleDeleteTask}
                    isLoading={loadingTaskId === task._id}
                    loadingAction={loadingTaskId === task._id ? actionType : null}
                  />
                ))}
              </div>
            )}

            <AddTodayTaskModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveTask}
              taskToEdit={taskToEdit}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TodayTasks;
