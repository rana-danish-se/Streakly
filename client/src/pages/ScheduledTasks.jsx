import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import scheduledTaskService from '../services/scheduledTaskService';
import AddScheduledTaskModal from '../components/AddScheduledTaskModal';
import ScheduledTaskCard from '../components/ScheduledTaskCard';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const ScheduledTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [actionType, setActionType] = useState(null);
  
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
      const data = await scheduledTaskService.getScheduledTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load scheduled tasks');
    } finally {
      setTasksLoading(false);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (taskToEdit) {
        // Update existing
        const updatedTask = await scheduledTaskService.updateScheduledTask(taskToEdit._id, taskData);
        setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
        toast.success('Scheduled task updated!');
      } else {
        // Create new
        const newTask = await scheduledTaskService.createScheduledTask(taskData);
        setTasks([...tasks, newTask]);
        toast.success('Task scheduled successfully!');
      }
      setTaskToEdit(null);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || error.message || 'Failed to save task';
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

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this scheduled task?')) return;
    
    setLoadingTaskId(taskId);
    setActionType('delete');
    
    try {
      await scheduledTaskService.deleteScheduledTask(taskId);
      setTasks(tasks.filter(t => t._id !== taskId));
      toast.success('Scheduled task deleted');
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

  // Group tasks by date category
  const groupedTasks = {
    tomorrow: [],
    thisWeek: [],
    later: []
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  tasks.forEach(task => {
    const taskDate = new Date(task.scheduledDate + 'T00:00:00');
    const diffDays = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      groupedTasks.tomorrow.push(task);
    } else if (diffDays <= 7) {
      groupedTasks.thisWeek.push(task);
    } else {
      groupedTasks.later.push(task);
    }
  });

  const totalCount = tasks.length;

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
          style={{ backgroundColor: '#F97316' }}
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
                  className="text-3xl font-bold"
                  style={{ color: 'var(--text)' }}
                >
                  <FaClock className="inline mr-2 mb-1" style={{ color: 'var(--primary)' }} />
                  Scheduled <span style={{ color: 'var(--primary)' }}>Tasks</span>
                </h1>
                <p className="mt-1" style={{ color: 'var(--text)', opacity: 0.7 }}>
                  Plan ahead. Scheduled tasks will appear in Today's Tasks on their due date.
                </p>
                {totalCount > 0 && (
                  <div className="mt-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                      <FaClock className="text-xs" style={{ color: 'var(--primary)' }} />
                      <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                        {totalCount} scheduled {totalCount === 1 ? 'task' : 'tasks'}
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
                <FaPlus /> Schedule Task
              </motion.button>
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
            ) : tasks.length === 0 ? (
              <div 
                className="text-center py-20 rounded-3xl border-2 border-dashed"
                style={{ 
                  backgroundColor: 'var(--card)', 
                  borderColor: 'var(--primary)',
                  opacity: 0.8
                }}
              >
                <FaClock className="mx-auto text-6xl mb-4" style={{ color: 'var(--primary)', opacity: 0.5 }} />
                <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--text)' }}>No scheduled tasks</h3>
                <p className="mb-6" style={{ color: 'var(--text)', opacity: 0.6 }}>Plan your future tasks and stay ahead!</p>
                <button
                  onClick={openAddModal}
                  className="font-medium hover:underline"
                  style={{ color: 'var(--primary)' }}
                >
                  Schedule your first task
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Tomorrow */}
                {groupedTasks.tomorrow.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#F97316' }}></span>
                      Tomorrow ({groupedTasks.tomorrow.length})
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {groupedTasks.tomorrow.map((task) => (
                        <ScheduledTaskCard
                          key={task._id}
                          task={task}
                          onEdit={openEditModal}
                          onDelete={handleDeleteTask}
                          isLoading={loadingTaskId === task._id}
                          loadingAction={loadingTaskId === task._id ? actionType : null}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* This Week */}
                {groupedTasks.thisWeek.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3B82F6' }}></span>
                      This Week ({groupedTasks.thisWeek.length})
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {groupedTasks.thisWeek.map((task) => (
                        <ScheduledTaskCard
                          key={task._id}
                          task={task}
                          onEdit={openEditModal}
                          onDelete={handleDeleteTask}
                          isLoading={loadingTaskId === task._id}
                          loadingAction={loadingTaskId === task._id ? actionType : null}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Later */}
                {groupedTasks.later.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#9CA3AF' }}></span>
                      Later ({groupedTasks.later.length})
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {groupedTasks.later.map((task) => (
                        <ScheduledTaskCard
                          key={task._id}
                          task={task}
                          onEdit={openEditModal}
                          onDelete={handleDeleteTask}
                          isLoading={loadingTaskId === task._id}
                          loadingAction={loadingTaskId === task._id ? actionType : null}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <AddScheduledTaskModal
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

export default ScheduledTasks;
