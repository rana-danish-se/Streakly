import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { 
  FiArrowLeft, FiCalendar, FiTarget, FiActivity, 
  FiTrendingUp, FiPlus, FiLink, FiFileText 
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import TaskItem from '../components/TaskItem';
import RenameJourneyModal from '../components/RenameJourneyModal';
import { 
  getJourney, createBulkTasks, updateTask, deleteTask, 
  completeJourney, reactivateJourney 
} from '../services/journeyService';
import Confetti from 'react-confetti';

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

  useEffect(() => {
    const fetchJourneyDetails = async () => {
      try {
        setLoading(true);
        const data = await getJourney(id);
        if (data.success) {
          setJourney(data.data.journey);
          setTasks(data.data.recentTasks || []);
          
          const j = data.data.journey;
          setStats({
            currentStreak: j.currentStreak || 0,
            longestStreak: j.longestStreak || 0,
            totalDays: j.totalDays || 0,
            progress: j.progress || 0
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

    // Check if journey is completed
    if (journey.status === 'completed') {
      toast.error('Journey is completed. Reactivate to add tasks.');
      return;
    }

    try {
      // Split by newline and filter empty lines
      const tasks = newTaskName.split('\n').map(t => t.trim()).filter(t => t);
      
      if (tasks.length === 0) return;

      const response = await createBulkTasks(id, tasks);
      
      if (response.success) {
        // Add new tasks to top of list
        setTasks(prev => [...response.data.tasks, ...prev]);
        setNewTaskName('');
        
        if (response.data.journeyStats) {
          setStats(prev => ({ ...prev, ...response.data.journeyStats }));
        }
        toast.success(`${tasks.length} task${tasks.length > 1 ? 's' : ''} added`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to add tasks');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await updateTask(taskId, updates);
      if (response.success) {
        // Update task in list
        setTasks(prev => prev.map(t => 
          t._id === taskId ? response.data.task : t
        ));

        // Update stats if returned (e.g. on completion toggle)
        if (response.data.journeyStats) {
          setStats(prev => ({ ...prev, ...response.data.journeyStats }));
          // Also update local journey state if needed
          setJourney(prev => ({
            ...prev,
            currentStreak: response.data.journeyStats.currentStreak
          }));
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
    if (!window.confirm('Are you sure you want to complete this journey? You won\'t be able to edit tasks unless you reactivate it.')) return;
    
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
    if (!window.confirm('Reactivate this journey? This will allow you to edit tasks again.')) return;
    
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
         <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!journey) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 p-4">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      <div className="flex gap-4 h-[calc(100vh-2rem)]">
        <Sidebar />
        
        <main className="flex-1 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col relative">
          
          {/* Header Banner */}
          <div className="h-48 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 relative shrink-0">
            <button
              onClick={() => navigate('/dashboard/journeys')}
              className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl text-white transition-all flex items-center gap-2 font-medium"
            >
              <FiArrowLeft /> Back to Journeys
            </button>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
               <div className="flex justify-between items-end">
                 <div>
                   <h1 className="text-4xl font-bold text-white mb-2">{journey.title}</h1>
                   <p className="text-white/90 text-lg max-w-2xl">{journey.description}</p>
                 </div>
                 <div className="flex gap-2">
                   {/* Completion Controls */}
                   {journey.status === 'active' && stats.progress === 100 && (
                     <button
                       onClick={handleCompleteJourney} 
                       className="p-2 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-300 transition-colors shadow-lg animate-bounce"
                       title="Complete Journey"
                     >
                       <p className="text-sm font-bold px-3">🏆 Finish Journey</p>
                     </button>
                   )}
                   
                   {journey.status === 'completed' && (
                     <button
                       onClick={handleReactivateJourney} 
                       className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/30 transition-colors"
                     >
                       <p className="text-sm font-medium px-2">Reactivate</p>
                     </button>
                   )}

                   <button 
                     onClick={() => setIsRenameModalOpen(true)}
                     className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/30 transition-colors"
                   >
                     <p className="text-sm font-medium px-2">Rename / Edit</p>
                   </button>
                 </div>
               </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-5xl mx-auto space-y-8">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/20">
                    <div className="flex items-center gap-2 mb-1 text-orange-600 dark:text-orange-400">
                      <FiActivity /> <span className="text-sm font-bold uppercase">Current Streak</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.currentStreak}</p>
                 </div>
                 <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/20">
                    <div className="flex items-center gap-2 mb-1 text-purple-600 dark:text-purple-400">
                      <FiTrendingUp /> <span className="text-sm font-bold uppercase">Best Streak</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.longestStreak}</p>
                 </div>
                 <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                    <div className="flex items-center gap-2 mb-1 text-blue-600 dark:text-blue-400">
                      <FiCalendar /> <span className="text-sm font-bold uppercase">Total Days</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalDays}</p>
                 </div>
                 <div className="p-4 bg-teal-50 dark:bg-teal-900/10 rounded-2xl border border-teal-100 dark:border-teal-900/20">
                    <div className="flex items-center gap-2 mb-1 text-teal-600 dark:text-teal-400">
                      <FiTarget /> <span className="text-sm font-bold uppercase">Progress</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.progress}%</p>
                 </div>
              </div>

              {/* Tasks Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Task List */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FiFileText className="text-teal-500" /> Tasks Log
                    </h2>
                  </div>
                  
                  {/* Add Task Input - Hide if completed */}
                  {journey.status !== 'completed' && (
                    <form onSubmit={handleCreateTask} className="relative">
                      <textarea
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        placeholder="Log new tasks (one per line)..."
                        rows={3}
                        className="w-full pl-6 pr-14 py-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-teal-500 focus:outline-none transition-all text-gray-900 dark:text-slate-50 placeholder:text-gray-400 resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleCreateTask(e);
                          }
                        }}
                      />
                      <button 
                        type="submit"
                        disabled={!newTaskName.trim()}
                        className="absolute right-2 top-2 p-2 bg-teal-600 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:shadow-none transition-all hover:scale-105"
                      >
                        <FiPlus className="w-5 h-5" />
                      </button>
                    </form>
                  )}

                  {journey.status === 'completed' && (
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-2xl border border-teal-100 dark:border-teal-900/30 text-center">
                      <p className="text-teal-800 dark:text-teal-200 font-medium text-lg">
                        🎉 This journey is completed on {new Date(journey.completedAt).toLocaleDateString()}!
                      </p>
                      <p className="text-teal-600 dark:text-teal-400 mt-1">
                        Reactivate it to make further changes.
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {tasks.length > 0 ? (
                      tasks.map(task => (
                        <TaskItem 
                          key={task._id} 
                          task={task} 
                          journeyStatus={journey.status}
                          startDate={journey.startDate}
                          onUpdate={handleUpdateTask} 
                          onDelete={handleDeleteTask}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                        <p className="text-gray-500 dark:text-slate-400">No tasks logged yet. Start your journey today!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar: Resources & Info */}
                <div className="space-y-6">
                   <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <FiLink className="text-blue-500" /> Resources
                      </h3>
                      {/* Placeholder for resources List */}
                      <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                        Add links, images, or files to support your journey.
                      </p>
                      <button className="w-full py-2 bg-white dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-gray-500 hover:border-teal-500 hover:text-teal-500 transition-all flex items-center justify-center gap-2 text-sm font-medium">
                        <FiPlus /> Add Resource
                      </button>
                   </div>
                </div>
              </div>

            </div>
          </div>
          
        </main>
      </div>

      <RenameJourneyModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        onSuccess={(updatedJourney) => {
          setJourney(updatedJourney);
          setIsRenameModalOpen(false);
        }}
        journey={journey}
      />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </div>
  );
};

export default JourneyDetails;
