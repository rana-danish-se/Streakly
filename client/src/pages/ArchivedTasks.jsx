import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArchive } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import archivedTaskService from '../services/archivedTaskService';
import ArchivedTaskCard from '../components/ArchivedTaskCard';
import ScheduleArchivedTaskModal from '../components/ScheduleArchivedTaskModal';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const ArchivedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [taskToSchedule, setTaskToSchedule] = useState(null);
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
      const data = await archivedTaskService.getArchivedTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load archived tasks');
    } finally {
      setTasksLoading(false);
    }
  };

  const handleMoveToToday = async (taskId) => {
    setLoadingTaskId(taskId);
    setActionType('move');
    try {
      await archivedTaskService.moveToToday(taskId);
      setTasks(tasks.filter(t => t._id !== taskId));
      toast.success('Task moved to Today!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to move task');
    } finally {
      setLoadingTaskId(null);
      setActionType(null);
    }
  };

  const openScheduleModal = (task) => {
    setTaskToSchedule(task);
    setIsScheduleModalOpen(true);
  };

  const handleScheduleTask = async (scheduledDate) => {
    if (!taskToSchedule) return;
    
    setLoadingTaskId(taskToSchedule._id);
    setActionType('schedule');
    
    try {
      await archivedTaskService.scheduleTask(taskToSchedule._id, scheduledDate);
      setTasks(tasks.filter(t => t._id !== taskToSchedule._id));
      setIsScheduleModalOpen(false);
      setTaskToSchedule(null);
      toast.success('Task scheduled successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to schedule task');
    } finally {
      setLoadingTaskId(null);
      setActionType(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to permanently delete this task?')) return;
    
    setLoadingTaskId(taskId);
    setActionType('delete');
    
    try {
      await archivedTaskService.deleteArchivedTask(taskId);
      setTasks(tasks.filter(t => t._id !== taskId));
      toast.success('Task deleted permanently');
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

  const totalCount = tasks.length;

  return (
    <div className="min-h-screen p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: '#6b7280' }} // Gray for archived
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
          style={{ backgroundColor: 'var(--primary)' }}
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
                  <FaArchive className="inline mr-3 mb-1" style={{ color: '#6b7280' }} />
                  Archived <span style={{ color: '#9ca3af' }}>Tasks</span>
                </h1>
                <p className="mt-1" style={{ color: 'var(--text)', opacity: 0.7 }}>
                  Tasks you missed from previous days. Give them a second chance!
                </p>
                {totalCount > 0 && (
                  <div className="mt-2 text-sm font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5" style={{ backgroundColor: 'rgba(107, 114, 128, 0.1)', color: 'var(--text)', border: '1px solid rgba(107, 114, 128, 0.2)' }}>
                    <span>{totalCount} archived {totalCount === 1 ? 'task' : 'tasks'}</span>
                  </div>
                )}
              </div>
            </div>

            {tasksLoading ? (
              <div className="flex justify-center p-12">
                <div 
                  className="w-12 h-12 border-4 rounded-full animate-spin"
                  style={{ 
                    borderColor: '#6b7280',
                    borderTopColor: 'transparent'
                  }}
                ></div>
              </div>
            ) : tasks.length === 0 ? (
              <div 
                className="text-center py-20 rounded-3xl border-2 border-dashed"
                style={{ 
                  backgroundColor: 'var(--card)', 
                  borderColor: 'rgba(107, 114, 128, 0.5)',
                  opacity: 0.8
                }}
              >
                <FaArchive className="mx-auto text-6xl mb-4" style={{ color: '#6b7280', opacity: 0.5 }} />
                <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--text)' }}>No archived tasks</h3>
                <p className="" style={{ color: 'var(--text)', opacity: 0.6 }}>You've been staying on top of your daily tasks. Great job!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {tasks.map((task) => (
                  <ArchivedTaskCard
                    key={task._id}
                    task={task}
                    onMoveToToday={handleMoveToToday}
                    onSchedule={openScheduleModal}
                    onDelete={handleDeleteTask}
                    isLoading={loadingTaskId === task._id}
                    loadingAction={loadingTaskId === task._id ? actionType : null}
                  />
                ))}
              </div>
            )}

            <ScheduleArchivedTaskModal
              isOpen={isScheduleModalOpen}
              onClose={() => {
                setIsScheduleModalOpen(false);
                setTaskToSchedule(null);
              }}
              onSave={handleScheduleTask}
              isLoading={loadingTaskId === taskToSchedule?._id}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ArchivedTasks;
