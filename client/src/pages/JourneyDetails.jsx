import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  FiArrowLeft, FiCalendar, FiTarget, FiActivity, 
  FiTrendingUp, FiPlus, FiMoreHorizontal, FiCheckCircle, FiClock
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import TaskItem from '../components/TaskItem';
import RenameJourneyModal from '../components/RenameJourneyModal';
import { 
  getJourney, createBulkTasks, updateTask, deleteTask, 
  completeJourney, reactivateJourney, startJourney 
} from '../services/journeyService';
import Confetti from 'react-confetti';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const JourneyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [journey, setJourney] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newTaskName, setNewTaskName] = useState('');
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  
  const [stats, setStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
    progress: 0
  });

  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sortTasks = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (a.completed) {
         return new Date(b.completedAt || 0) - new Date(a.completedAt || 0);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  useEffect(() => {
    const fetchJourneyDetails = async () => {
      try {
        setLoading(true);
        const data = await getJourney(id);
        if (data.success) {
          setJourney(data.data.journey);
          setTasks(sortTasks(data.data.recentTasks || []));
          setStats(data.data.journeyStats || {
            currentStreak: data.data.journey.currentStreak || 0,
            longestStreak: data.data.journey.longestStreak || 0,
            totalDays: data.data.journey.totalDays || 0,
            progress: data.data.journey.progress || 0
          });
        }
      } catch (error) {
        console.error('Error fetching journey:', error);
        toast.error('Failed to load journey details');
        navigate('/dashboard/journeys');
      } finally {
        setLoading(false);
      }
    };

    fetchJourneyDetails();
  }, [id, navigate]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    if (journey.status === 'completed') {
      toast.error('Journey is completed. Reactivate to add tasks.');
      return;
    }

    try {
      const tasksList = newTaskName.split('\n').map(t => t.trim()).filter(t => t);
      if (tasksList.length === 0) return;

      const response = await createBulkTasks(id, tasksList);
      
      if (response.success) {
        setTasks(prev => sortTasks([...response.data.tasks, ...prev]));
        setNewTaskName('');
        if (response.data.journeyStats) {
          setStats(prev => ({ ...prev, ...response.data.journeyStats }));
        }
        toast.success(`${tasksList.length} task${tasksList.length > 1 ? 's' : ''} added`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add tasks');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await updateTask(taskId, updates);
      if (response.success) {
        setTasks(prev => {
          const updatedTasks = prev.map(t => t._id === taskId ? response.data.task : t);
          return sortTasks(updatedTasks);
        });

        if (response.data.journeyStats) {
          setStats(prev => ({ ...prev, ...response.data.journeyStats }));
          setJourney(prev => ({ ...prev, currentStreak: response.data.journeyStats.currentStreak }));
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const response = await deleteTask(taskId);
      if (response.success) {
        setTasks(prev => prev.filter(t => t._id !== taskId));
        if (response.data.journeyStats) {
          setStats(prev => ({ ...prev, ...response.data.journeyStats }));
        }
        toast.success('Task deleted');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleCompleteJourney = async () => {
    if (!window.confirm('Are you sure you want to complete this journey?')) return;
    try {
      const response = await completeJourney(id);
      if (response.success) {
        setJourney(response.data);
        setShowConfetti(true);
        toast.success('Congratulations! Journey Completed! 🎉');
        setTimeout(() => setShowConfetti(false), 8000);
      }
    } catch (err) {
      toast.error('Failed to complete journey');
    }
  };

  const handleReactivateJourney = async () => {
    if (!window.confirm('Reactivate this journey?')) return;
    try {
      const response = await reactivateJourney(id);
      if (response.success) {
        setJourney(response.data);
        toast.success('Journey reactivated');
      }
    } catch (err) {
      toast.error('Failed to reactivate journey');
    }
  };

  const handleStartJourney = async () => {
    if (!window.confirm('Start this journey now?')) return;
    try {
      const response = await startJourney(id);
      if (response.success) {
        setJourney(prev => ({ ...prev, status: 'active', isActive: true, startDate: new Date().toISOString() }));
        toast.success("Journey started! Good luck! 🚀");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start journey');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
         <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!journey) return null;

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-slate-950">
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button
                  onClick={() => navigate('/dashboard/journeys')}
                  className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors text-slate-500"
               >
                 <FiArrowLeft className="w-5 h-5" />
               </button>
               <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{journey.title}</h1>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                      journey.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                      journey.status === 'active' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {journey.status.charAt(0).toUpperCase() + journey.status.slice(1)}
                    </span>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-2">
               {journey.status === 'active' && stats.progress === 100 && (
                 <button onClick={handleCompleteJourney} className="btn-primary bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                   Finish Journey
                 </button>
               )}
               {journey.status === 'pending' && (
                 <button onClick={handleStartJourney} className="btn-primary bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                   Activate Now
                 </button>
               )}
               {journey.status === 'completed' && (
                 <button onClick={handleReactivateJourney} className="btn-secondary border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-slate-700 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800">
                   Reactivate
                 </button>
               )}
               <button 
                  onClick={() => setIsRenameModalOpen(true)}
                  className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
               >
                  <FiMoreHorizontal className="w-5 h-5" />
               </button>
            </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
           <div className="max-w-5xl mx-auto space-y-10">
              
              {/* Stats Overview */}
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="col-span-1 md:col-span-1 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-5">
                    <div className="w-16 h-16">
                      <CircularProgressbar
                        value={stats.progress}
                        text={`${stats.progress}%`}
                        styles={buildStyles({
                          textSize: '24px',
                          pathColor: '#0f172a', // Slate-900
                          textColor: '#0f172a',
                          trailColor: '#f1f5f9', // Slate-100
                          pathTransitionDuration: 0.5,
                        })}
                      />
                    </div>
                    <div>
                       <div className="text-sm text-slate-500 font-medium">Progress</div>
                       <div className="text-sm text-slate-400">{stats.totalDays} days log</div>
                    </div>
                 </div>

                 <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                       <FiActivity /> Current Streak
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                       {stats.currentStreak} <span className="text-sm font-normal text-slate-400">days</span>
                    </div>
                 </div>

                 <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                       <FiTrendingUp /> Best Streak
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                       {stats.longestStreak} <span className="text-sm font-normal text-slate-400">days</span>
                    </div>
                 </div>

                 <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                       <FiCalendar /> Started
                    </div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                       {new Date(journey.startDate).toLocaleDateString()}
                    </div>
                 </div>
              </section>

              {/* Task Board */}
              <section className="space-y-6">
                 <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Tasks</h2>
                    <span className="text-sm text-slate-400">{tasks.length} entries</span>
                 </div>

                 {journey.status !== 'completed' && (
                    <div className="relative">
                       <input 
                          type="text" 
                          placeholder="Type a new task and press Enter..." 
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 transition-all"
                          value={newTaskName}
                          onChange={(e) => setNewTaskName(e.target.value)}
                          onKeyDown={(e) => {
                             if (e.key === 'Enter') handleCreateTask(e);
                          }}
                       />
                       <div className="absolute right-3 top-3 text-xs text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">Enter</div>
                    </div>
                 )}

                 {journey.status === 'completed' && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center text-sm text-slate-600">
                       Journey completed. <button onClick={handleReactivateJourney} className="text-slate-900 font-medium underline">Reactivate</button> to add tasks.
                    </div>
                 )}

                 <div className="space-y-1">
                    <AnimatePresence initial={false}>
                       {tasks.map(task => (
                          <TaskItem 
                            key={task._id} 
                            task={task} 
                            journeyStatus={journey.status}
                            startDate={journey.startDate}
                            onUpdate={handleUpdateTask} 
                            onDelete={handleDeleteTask}
                            minimal={true}
                          />
                       ))}
                    </AnimatePresence>
                    {tasks.length === 0 && (
                       <div className="py-12 text-center text-slate-400 text-sm">
                          No tasks yet.
                       </div>
                    )}
                 </div>
              </section>

           </div>
        </div>
      </main>

      <RenameJourneyModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        onSuccess={(updatedJourney) => {
          setJourney(updatedJourney);
          setIsRenameModalOpen(false);
        }}
        journey={journey}
      />
    </div>
  );
};

export default JourneyDetails;
