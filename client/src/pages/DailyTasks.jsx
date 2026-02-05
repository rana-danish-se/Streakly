
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaFire, FaCheck, FaTrash, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import dailyTaskService from '../services/dailyTaskService';
import AddDailyTaskModal from '../components/AddDailyTaskModal';
import DailyTaskCard from '../components/DailyTaskCard';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Confetti from 'react-confetti';

const DailyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null); // New state for editing
  const [loadingTaskId, setLoadingTaskId] = useState(null); // Track which task is loading
  const [actionType, setActionType] = useState(null); // Track type of action: 'toggle', 'delete'
  const [showConfetti, setShowConfetti] = useState(false);
  
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
      const data = await dailyTaskService.getDailyTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load tasks');
    } finally {
      setTasksLoading(false);
    }
  };

  // Unified save handler (Create or Update)
  const handleSaveTask = async (taskData) => {
    try {
      if (taskToEdit) {
        // Update existing
        const updatedTask = await dailyTaskService.updateDailyTask(taskToEdit._id, taskData);
        setTasks(tasks.map(t => t._id === updatedTask._id ? { ...updatedTask, completedToday: t.completedToday, currentStreak: t.currentStreak } : t));
        toast.success('Habit updated successfully!');
      } else {
        // Create new
        const newTask = await dailyTaskService.createDailyTask(taskData);
        setTasks([...tasks, { ...newTask, completedToday: false }]); 
        toast.success('Habit added successfully!');
      }
      setTaskToEdit(null); // Reset edit state
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Failed to save habit';
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
            const updatedTask = await dailyTaskService.toggleTaskCompletion(task._id);
            
            setTasks(tasks.map(t => 
                t._id === task._id 
                    ? { ...updatedTask, completedToday: updatedTask.completedDates?.includes(new Date().toISOString().split('T')[0]) }
                    : t
            ));

            if (updatedTask.completedDates?.includes(new Date().toISOString().split('T')[0])) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
                toast.success('Great job! Keep the streak going! 🔥');
            } else {
                toast.info('Task unmarked for today');
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
        if (!window.confirm('Are you sure you want to delete this habit?')) return;
        
        setLoadingTaskId(taskId);
        setActionType('delete');
        
        try {
            await dailyTaskService.deleteDailyTask(taskId);
            setTasks(tasks.filter(t => t._id !== taskId));
            toast.success('Habit deleted successfully');
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete habit');
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
                        style={{ color: 'var(--text)' }} // Fallback/Secondary
                    >
                        Daily Habits <span style={{ color: 'var(--primary)' }}>& Streaks</span>
                    </h1>
                    <p className="mt-1" style={{ color: 'var(--text)', opacity: 0.7 }}>
                        Build consistency with small daily actions.
                    </p>
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
                    <FaPlus /> Add Habit
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
                        <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--text)' }}>No habits yet</h3>
                        <p className="mb-6" style={{ color: 'var(--text)', opacity: 0.6 }}>Start building your streak today!</p>
                        <button
                            onClick={openAddModal}
                            className="font-medium hover:underline"
                            style={{ color: 'var(--primary)' }}
                        >
                            Create your first habit
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {tasks.map((task) => (
                        <DailyTaskCard
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

                <AddDailyTaskModal
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

export default DailyTasks;
