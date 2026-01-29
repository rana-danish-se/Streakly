import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import RenameJourneyModal from '../components/RenameJourneyModal';
import { 
  getJourney, createBulkTasks, updateTask, deleteTask, 
  completeJourney, reactivateJourney, startJourney, deleteJourney,
  getTopics, createTopic, updateTopic, deleteTopic
} from '../services/journeyService';
import Confetti from 'react-confetti';

import JourneyHeader from '../components/JourneyHeader';
import JourneyDetailStats from '../components/JourneyDetailStats';
import TopicList from '../components/TopicList';

const JourneyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [journey, setJourney] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
  
  // Loading states
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [journeyActionLoading, setJourneyActionLoading] = useState(null); // 'start', 'delete', 'reactivate', 'complete'

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
          setStats(data.data.journeyStats || {
            currentStreak: data.data.journey.currentStreak || 0,
            longestStreak: data.data.journey.longestStreak || 0,
            totalDays: data.data.journey.totalDays || 0,
            progress: data.data.journey.progress || 0
          });
          
          // Fetch topics
          const topicsData = await getTopics(id);
          if (topicsData.success) {
            setTopics(topicsData.data);
          }
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

  // Topic handlers
  const handleAddTopic = async (titleInput) => {
    if (journey.status === 'completed') {
       toast.info('Journey is completed. Reactivate journey to make changes.');
       return;
    }
    // Split by newlines and filter empty
    const titles = titleInput.split('\n').map(t => t.trim()).filter(t => t);
    if (titles.length === 0) return;

    setIsAddingTopic(true);
    // We create them one by one or we could add a bulk endpoint. Since user won't likely add 100s, loop is fine.
    // To avoid too many renders/toasts, we can promise.all
    try {
        const responses = [];
        for (const title of titles) {
            const response = await createTopic(id, { title });
            responses.push(response);
        }
        
        const newTopics = responses.filter(r => r.success).map(r => r.data.topic);
        
        // Use stats from the last successful response (approximation, but better than nothing)
        const lastSuccess = responses.findLast(r => r.success);
        if (lastSuccess && lastSuccess.data.journeyStats) {
             setStats(prev => ({ ...prev, ...lastSuccess.data.journeyStats }));
        }

        if (newTopics.length > 0) {
            setTopics(prev => [...prev, ...newTopics]);
            toast.success(`${newTopics.length} topic(s) added`);
        }
    } catch {
        toast.error("Failed to add some topics");
    } finally {
        setIsAddingTopic(false);
    }
  };

  const handleAddSubtopic = async (parentId, titleInput) => {
    if (journey.status === 'completed') {
        toast.info('Journey is completed. Reactivate journey to make changes.');
        return;
    }
    let titles = [];
    if (Array.isArray(titleInput)) {
        titles = titleInput;
    } else if (typeof titleInput === 'string' && titleInput.trim()) {
        titles = [titleInput];
    } else {
        const input = prompt("Enter subtopic title:");
        if (input) titles = [input];
    }
    
    if (titles.length === 0) return;

    try {
      const responses = [];
      for (const title of titles) {
          const response = await createTopic(id, { title, parentId });
          responses.push(response);
      }

      const newTopics = responses.filter(r => r.success).map(r => r.data.topic);
      if (newTopics.length > 0) {
        setTopics(prev => [...prev, ...newTopics]);
        
        const lastSuccess = responses.findLast(r => r.success);
        if (lastSuccess && lastSuccess.data.journeyStats) {
             setStats(prev => ({ ...prev, ...lastSuccess.data.journeyStats }));
        }
        toast.success(`${newTopics.length} subtopic(s) added`);
      }
    } catch {
      toast.error("Failed to add subtopics");
    }
  };

  const handleEditTopic = async (topic, isRename = false) => {
      if (journey.status === 'completed') {
           toast.info('Journey is completed. Reactivate journey to make changes.');
           return;
      }
      let updates = {};
      if (isRename) {
          const title = prompt("Edit topic title:", topic.title);
          if (!title || title === topic.title) return;
          updates = { title };
      } else {
        // Assume topic object contains the updates desired (e.g. completed)
        if (topic.completed !== undefined) updates.completed = topic.completed;

        if (updates.completed === true && journey.status === 'pending') {
            const dateStr = journey.startDate ? new Date(journey.startDate).toLocaleDateString() : 'a future date';
            toast.info(`Journey will start on ${dateStr}. Can't mark it complete.`);
            return;
        }
      }
      
      try {
        const response = await updateTopic(topic._id, updates);
        if (response.success) {
            // Update the main topic
            setTopics(prev => {
                let newTopics = prev.map(t => t._id === topic._id ? response.data.topic : t);
                
                // If backend returned other updated topics (e.g. parent auto-completed), update them too
                if (response.data.updatedTopics && response.data.updatedTopics.length > 0) {
                    const updatedMap = new Map(response.data.updatedTopics.map(t => [t._id, t]));
                    newTopics = newTopics.map(t => updatedMap.has(t._id) ? updatedMap.get(t._id) : t);
                }
                return newTopics;
            });
            
            // If backend returned updated tasks (e.g. recursive unmark), update them
            if (response.data.updatedTasks && response.data.updatedTasks.length > 0) {
                const updatedTaskMap = new Map(response.data.updatedTasks.map(t => [t._id, t]));
                setTasks(prev => prev.map(t => updatedTaskMap.has(t._id) ? updatedTaskMap.get(t._id) : t));
            }

            if (response.data.journeyStats) {
                setStats(prev => ({ ...prev, ...response.data.journeyStats }));
            }
            if (updates.completed !== undefined) {
               toast.success(updates.completed ? "Topic marked completed" : "Topic active");
            } else {
               toast.success("Topic updated");
            }
        }
      } catch (err) {
        console.error("Topic update error:", err);
        const errorMsg = err.response?.data?.message || err.message || "Failed to update topic";
        toast.error(errorMsg);
      }
  };

  const handleDeleteTopic = async (topicId) => {
    if (journey.status === 'completed') {
        toast.info('Journey is completed. Reactivate journey to make changes.');
        return;
    }
    if(!window.confirm("Delete this topic and all its contents?")) return;
    try {
        const response = await deleteTopic(topicId);
        // Api service returns response.data directly, which should contain success: true
        if (response.success) {
            // Remove all deleted topics (including subtopics)
            const deletedTopicIds = new Set(response.data.deletedTopicIds || [topicId]);
            setTopics(prev => prev.filter(t => !deletedTopicIds.has(t._id)));
            
            // Remove all deleted tasks
            const deletedTaskIds = new Set(response.data.deletedTaskIds || []);
            // Also fallback: remove tasks that belonged to deleted topics (if backend didn't return IDs for some reason)
            setTasks(prev => prev.filter(t => !deletedTaskIds.has(t._id) && !deletedTopicIds.has(t.topic))); 

            if (response.data.journeyStats) {
                setStats(prev => ({ ...prev, ...response.data.journeyStats }));
            }
            toast.success("Topic and contents deleted");
        } else {
             console.error("Delete response unsuccessful:", response);
             toast.error(response.message || "Failed to delete topic");
        }
    } catch (error) {
        console.error("Delete topic error:", error);
        toast.error("Failed to delete topic");
    }
  };

  // Task handlers
  const handleAddTask = async (topicId, taskList) => {
      if (journey.status === 'completed') {
           toast.info('Journey is completed. Reactivate journey to make changes.');
           return;
      }
      // taskList can be array (from bulk input) or single string? 
      // JourneyTaskInput returns array of strings.
      if (!taskList || taskList.length === 0) return;

      try {
          const response = await createBulkTasks(id, taskList, topicId);
          if (response.success) {
             setTasks(prev => [...response.data.tasks, ...prev]);
             if (response.data.journeyStats) {
                 setStats(prev => ({ ...prev, ...response.data.journeyStats }));
             }
             toast.success("Tasks added");
          }
      } catch {
          toast.error("Failed to add tasks");
      }
  };

  const handleUpdateTask = async (taskId, updates) => {
    if (journey.status === 'completed') {
        toast.info('Journey is completed. Reactivate journey to make changes.');
        return;
    }
    try {
      const response = await updateTask(taskId, updates);
      if (response.success) {
        setTasks(prev => prev.map(t => t._id === taskId ? response.data.task : t));
        
        if (response.data.updatedTopics && response.data.updatedTopics.length > 0) {
             setTopics(prev => {
                const updatedMap = new Map(response.data.updatedTopics.map(t => [t._id, t]));
                return prev.map(t => updatedMap.has(t._id) ? updatedMap.get(t._id) : t);
             });
        }
        
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
    if (journey.status === 'completed') {
        toast.info('Journey is completed. Reactivate journey to make changes.');
        return;
    }
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

  const handleCompleteJourney = async (notes) => {
    setJourneyActionLoading('complete');
    try {
      const response = await completeJourney(id, notes);
      if (response.success) {
        setJourney(prev => ({ ...prev, status: 'completed', completedAt: new Date().toISOString() }));
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 8000);
        toast.success("Journey completed! Congratulations!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete journey');
    } finally {
        setJourneyActionLoading(null);
    }
  };

  const handleReactivateJourney = async () => {
    if (!window.confirm('Reactivate this journey?')) return;
    setJourneyActionLoading('reactivate');
    try {
      const response = await reactivateJourney(id);
      if (response.success) {
        setJourney(prev => ({ ...prev, status: 'active', isActive: true }));
        toast.success("Journey reactivated");
      }
    } catch {
      toast.error('Failed to reactivate journey');
    } finally {
        setJourneyActionLoading(null);
    }
  };

  const handleStartJourney = async () => {
    if (!window.confirm('Start this journey now?')) return;
    setJourneyActionLoading('start');
    try {
      const response = await startJourney(id);
      if (response.success) {
        setJourney(prev => ({ ...prev, status: 'active', isActive: true, startDate: new Date().toISOString() }));
        toast.success("Journey started! Good luck! 🚀");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start journey');
    } finally {
        setJourneyActionLoading(null);
    }
  };
    
  const handleDeleteJourney = async () => {
      if (!window.confirm('Are you sure you want to delete this journey? This action cannot be undone.')) return;
      setJourneyActionLoading('delete');
      try {
          await deleteJourney(id);
          toast.success('Journey deleted successfully');
          navigate('/dashboard/journeys');
      } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to delete journey');
          setJourneyActionLoading(null);
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
    <div className="h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 overflow-hidden flex">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      <Sidebar />

      <main className="flex-1 lg:ml-80 h-full overflow-y-auto overflow-x-hidden p-6 relative bg-white dark:bg-slate-950 scrollbar-hide">
        
        <JourneyHeader 
            journey={journey}
            stats={stats}
            onEdit={() => setIsRenameModalOpen(true)}
            onDelete={handleDeleteJourney}
            onComplete={handleCompleteJourney}
            onReactivate={handleReactivateJourney}
            onStart={handleStartJourney}
            loadingAction={journeyActionLoading}
        />

        <JourneyDetailStats 
          stats={{
            ...(stats || {}),
            totalTopics: topics.length,
            completedTopics: topics.filter(t => t.completed).length
          }} 
          tasks={tasks} 
        />

        {/* Replaced Global Task Input with Add Topic Button mainly, or specific inputs */}
<div className="max-w-4xl mx-auto mt-8">
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between items-baseline mb-4">
            <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Add New Topics
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Add multiple topics, one per line
                </p>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                <span className="text-xs">⌘</span> + <span className="text-xs">↵</span>
            </kbd>
        </div>
        
        <div className="flex gap-3 items-start">
            <div className="flex-1 relative">
                <textarea 
                    placeholder="e.g. Fundamentals&#10;Advanced Concepts&#10;Best Practices"
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                             text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500
                             min-h-[100px] resize-y transition-shadow"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault();
                            if(e.target.value.trim()){
                               handleAddTopic(e.target.value);
                               e.target.value = '';
                            }
                        }
                    }}
                    id="new-topic-input"
                    aria-label="Enter new topics"
                />
            </div>
            
            <button 
                onClick={() => {
                    const input = document.getElementById('new-topic-input');
                    if (input.value.trim()) {
                        handleAddTopic(input.value);
                        input.value = '';
                    }
                }}
                disabled={isAddingTopic}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
                         disabled:bg-indigo-300 disabled:cursor-not-allowed 
                         text-white font-medium rounded-lg 
                         transition-all duration-200 ease-in-out
                         h-[100px] flex items-center justify-center min-w-[100px]
                         shadow-sm hover:shadow-md disabled:shadow-none
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Add topics"
            >
                {isAddingTopic ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="text-xs">Adding...</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-sm font-semibold">Add</span>
                    </div>
                )}
            </button>
        </div>
    </div>
</div>

        <div className="max-w-4xl mx-auto mt-6 mb-20">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Your Learning Path</h2>
            <TopicList 
               topics={topics}
               tasks={tasks}
               journeyStatus={journey.status}
               startDate={journey.startDate}
               onAddSubtopic={handleAddSubtopic}
               onAddTask={handleAddTask}
               onUpdateTask={handleUpdateTask}
               onDeleteTask={handleDeleteTask}
               onEditTopic={handleEditTopic}
               onDeleteTopic={handleDeleteTopic}
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
