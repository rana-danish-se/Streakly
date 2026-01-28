import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  FiArrowLeft, FiMoreHorizontal, FiCheckCircle
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import RenameJourneyModal from '../components/RenameJourneyModal';
import { 
  getJourney, createBulkTasks, updateTask, deleteTask, 
  completeJourney, reactivateJourney, startJourney, deleteJourney 
} from '../services/journeyService';
import Confetti from 'react-confetti';

import JourneyHeader from '../components/JourneyHeader';
import JourneyDetailStats from '../components/JourneyDetailStats';
import JourneyTaskInput from '../components/JourneyTaskInput';
import JourneyTaskList from '../components/JourneyTaskList';

const JourneyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [journey, setJourney] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  
  const [stats, setStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
    progress: 0
  });
  /*
    const [stats, setStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
    progress: 0
  });
  */

  const handleAddTasks = async (tasksList) => {
    if (journey.status === 'completed') {
      toast.error('Journey is completed. Reactivate to add tasks.');
      return;
    }

    try {
      const response = await createBulkTasks(id, tasksList);
      
      if (response.success) {
        setTasks(prev => {
          return [...response.data.tasks, ...prev];
        });
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
        setTasks(prev => prev.map(t => t._id === taskId ? response.data.task : t));

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

  /*
  const sortTasks = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (a.completed) {
         return new Date(b.completedAt || 0) - new Date(a.completedAt || 0);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };
  */

  useEffect(() => {
    const fetchJourneyDetails = async () => {
      try {
        setLoading(true);
        const data = await getJourney(id);
        if (data.success) {
          setJourney(data.data.journey);
          setTasks(data.data.recentTasks || []);
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
    } catch {
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
    } catch {
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
    
  const handleDeleteJourney = async () => {
      if (!window.confirm('Are you sure you want to delete this journey? This action cannot be undone.')) return;
      try {
          await deleteJourney(id);
          toast.success('Journey deleted successfully');
          navigate('/dashboard/journeys');
      } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to delete journey');
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
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      <Sidebar />

      <main className="lg:ml-80 overflow-x-hidden p-6 min-h-screen relative bg-white dark:bg-slate-950">
        
        <JourneyHeader 
            journey={journey}
            stats={stats}
            onEdit={() => setIsRenameModalOpen(true)}
            onDelete={handleDeleteJourney}
            onComplete={handleCompleteJourney}
            onReactivate={handleReactivateJourney}
            onStart={handleStartJourney}
        />

        <JourneyDetailStats stats={stats} tasks={tasks} />

        <div className="max-w-4xl mx-auto mt-8">
           <JourneyTaskInput 
              onAddTasks={handleAddTasks} 
              disabled={loading || journey.status === 'completed'} 
           />
        </div>

        <div className="max-w-4xl mx-auto mt-12 mb-20">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Your Plan</h2>
            <JourneyTaskList 
               tasks={tasks}
               journeyStatus={journey.status}
               startDate={journey.startDate}
               onUpdate={handleUpdateTask}
               onDelete={handleDeleteTask}
            />
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
